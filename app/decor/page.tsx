// app/decor/page.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DecorFilters, defaultFilters, type FiltersState } from "@/components/decor/Filters";
import { DecorCard } from "@/components/decor/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpAZ, ArrowDownAZ } from "lucide-react";
import type { DecorItem, StoneType, SurfaceType } from "@/lib/decor-data";
import { toStoneType, toSurfaceType } from "@/lib/decor-data";

type SortKey = "price_asc" | "price_desc" | "newest";

type ApiDecor = {
    id: number;
    slug: string;
    name: string;
    code?: string | null;
    brand: string;
    stone_type: string;
    surface: string;
    price: number;
    created_at: number; // unix seconds
    image: string;
    images?: string[] | null;
    description?: string | null;
};

type ApiResponse = {
    items: ApiDecor[];
    total: number;
    limit: number;
    offset: number;
    facets: {
        stone_types: string[];
        surfaces: string[];
        brands?: string[];
    };
};

const API_BASE = "https://eden-stone.ru";

/** API → DecorItem */
function mapApiDecor(d: ApiDecor): DecorItem {
    return {
        id: String(d.id),
        slug: d.slug,
        name: d.name,
        code: d.code ?? "",
        brand: d.brand,
        stoneType: toStoneType(d.stone_type),
        surface: toSurfaceType(d.surface),
        price: d.price,
        createdAt: new Date(d.created_at * 1000).toISOString(),
        image: d.image || "",
        images: d.images ?? undefined,
        description: d.description ?? undefined,
    };
}

function buildQuery(params: Record<string, string | number | undefined>) {
    const usp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== "") usp.set(k, String(v));
    });
    return usp.toString();
}

export default function DecorCatalogPage() {
    const [filters, setFilters] = useState<FiltersState>(defaultFilters);
    const [sort, setSort] = useState<SortKey>("newest");
    const [view] = useState<"grid" | "rows">("grid");

    // страница = размер пачки для «загрузить ещё»
    const [limit, setLimit] = useState<number>(24);

    // серверные данные и фасеты
    const [items, setItems] = useState<DecorItem[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [offset, setOffset] = useState<number>(0);
    const [allStoneTypes, setAllStoneTypes] = useState<StoneType[]>([]);
    const [allSurfaces, setAllSurfaces] = useState<SurfaceType[]>([]);
    const [allBrands, setAllBrands] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [err, setErr] = useState<string | null>(null);

    // Чтобы сбрасывать ленту при изменении параметров, считаем ключ запроса
    const queryKey = useMemo(() => {
        const stoneType = filters.stoneTypes[0] ?? "";
        const surface = filters.surfaces[0] ?? "";
        const brand = filters.brands[0] ?? "";
        const sortParam =
            sort === "newest" ? "created_at_desc" :
                sort === "price_asc" ? "price_asc" : "price_desc";
        return JSON.stringify({ stoneType, surface, brand, sortParam, limit });
    }, [filters.stoneTypes, filters.surfaces, filters.brands, sort, limit]);

    // защита от гонок ответов
    const reqSeq = useRef(0);

    const loadPage = useCallback(async (opts?: { reset?: boolean }) => {
        const isReset = !!opts?.reset;

        // сервер сейчас принимает по одному значению каждого фильтра
        const stoneType = filters.stoneTypes[0];
        const surface = filters.surfaces[0];
        const brand = filters.brands[0];

        const sortParam =
            sort === "newest" ? "created_at_desc" :
                sort === "price_asc" ? "price_asc" : "price_desc";

        const nextOffset = isReset ? 0 : offset;
        const qs = buildQuery({
            limit,
            offset: nextOffset,
            sort: sortParam,
            stone_type: stoneType,
            surface: surface,
            brand: brand,
        });

        setLoading(true);
        setErr(null);
        const mySeq = ++reqSeq.current;

        try {
            const res = await fetch(`${API_BASE}/api/v1/decors?${qs}`, { cache: "no-store" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data: ApiResponse = await res.json();

            if (mySeq !== reqSeq.current) return; // устаревший ответ

            const mapped = data.items.map(mapApiDecor);

            if (isReset) {
                setItems(mapped);
                setOffset(mapped.length);
                setTotal(data.total ?? mapped.length);

                // фасеты обновляем на «сбросе» (первой загрузке)
                const stoneTypesSafe = (data.facets?.stone_types ?? [])
                    .map((s) => toStoneType(s as string))
                    .filter((v, i, arr) => arr.indexOf(v) === i);
                const surfacesSafe = (data.facets?.surfaces ?? [])
                    .map((s) => toSurfaceType(s as string))
                    .filter((v, i, arr) => arr.indexOf(v) === i);
                setAllStoneTypes(stoneTypesSafe);
                setAllSurfaces(surfacesSafe);
                if (data.facets?.brands?.length) {
                    setAllBrands([...new Set(data.facets.brands)].sort((a, b) => a.localeCompare(b)));
                } else {
                    const brandsSet = new Set<string>();
                    mapped.forEach((i) => brandsSet.add(i.brand));
                    setAllBrands(Array.from(brandsSet).sort((a, b) => a.localeCompare(b)));
                }
            } else {
                setItems((prev) => [...prev, ...mapped]);
                setOffset(nextOffset + mapped.length);
                setTotal((t) => data.total ?? t);
            }
        } catch (e: unknown) {
            if (mySeq !== reqSeq.current) return;
            const message =
                e instanceof Error
                    ? e.message
                    : typeof e === "string"
                        ? e
                        : "Request failed";
            setErr(message);
        } finally {
            if (mySeq === reqSeq.current) setLoading(false);
        }
    }, [filters.stoneTypes, filters.surfaces, filters.brands, sort, limit, offset]);

    // при смене ключевых параметров — сбрасываем и грузим первую пачку
    useEffect(() => {
        setItems([]);
        setOffset(0);
        setTotal(0);
        loadPage({ reset: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryKey]);

    // доп. клиентская фильтрация — если пользователь выбрал >1 значения
    const filtered = useMemo(() => {
        let arr = [...items];
        if (filters.stoneTypes.length > 1) {
            arr = arr.filter((i) => filters.stoneTypes.includes(i.stoneType));
        }
        if (filters.surfaces.length > 1) {
            arr = arr.filter((i) => filters.surfaces.includes(i.surface));
        }
        if (filters.brands.length > 1) {
            arr = arr.filter((i) => filters.brands.includes(i.brand));
        }
        return arr;
    }, [items, filters]);

    const hasMore = offset < total; // есть ещё на сервере
    const loadMore = () => {
        if (!loading && hasMore) loadPage();
    };

    return (
        <section className="container mx-auto px-4 py-10 lg:py-14">
            <div className="flex items-end justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Каталог декоров</h1>
                    <p className="text-muted-foreground">Подберите идеальный цвет и фактуру под ваш проект.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-3">
                    <DecorFilters
                        values={filters}
                        onChange={(v) => {
                            setFilters(v);
                        }}
                        allBrands={allBrands}
                        allStoneTypes={allStoneTypes}
                        allSurfaces={allSurfaces}
                    />
                </div>

                <div className="lg:col-span-9 space-y-6">
                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <Select value={sort} onValueChange={(v: SortKey) => setSort(v)}>
                                <SelectTrigger className="w-56">
                                    <SelectValue placeholder="Сортировка" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">
                                        <div className="flex items-center gap-2"><ArrowDownAZ className="h-4 w-4" /> Новизна</div>
                                    </SelectItem>
                                    <SelectItem value="price_asc">
                                        <div className="flex items-center gap-2"><ArrowUpAZ className="h-4 w-4" /> По возрастанию цены</div>
                                    </SelectItem>
                                    <SelectItem value="price_desc">
                                        <div className="flex items-center gap-2"><ArrowDownAZ className="h-4 w-4" /> По убыванию цены</div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={String(limit)} onValueChange={(v) => setLimit(Number(v))}>
                                <SelectTrigger className="w-28">
                                    <SelectValue placeholder="На странице" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="12">12</SelectItem>
                                    <SelectItem value="24">24</SelectItem>
                                    <SelectItem value="48">48</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Status */}
                    {err && <div className="text-red-500">Ошибка: {err}</div>}
                    {loading && items.length === 0 && <div className="text-muted-foreground">Загрузка…</div>}

                    {/* Results count */}
                    <div className="text-sm text-muted-foreground">
                        Показано: {filtered.length}{total ? ` • Всего: ${total}` : ""}
                    </div>

                    {/* Grid / Rows */}
                    {filtered.length ? (
                        <>
                            <div className={view === "grid" ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3" : "space-y-4"}>
                                {filtered.map((item) => (
                                    <div key={item.id} className={view === "rows" ? "grid grid-cols-1 md:grid-cols-3 gap-4" : ""}>
                                        <DecorCard item={item} />
                                    </div>
                                ))}
                            </div>

                            {/* Load more */}
                            {hasMore && (
                                <div className="flex justify-center pt-4">
                                    <button
                                        onClick={loadMore}
                                        disabled={loading}
                                        className="px-5 py-2.5 rounded-md border shadow-sm text-sm hover:bg-accent disabled:opacity-50"
                                    >
                                        {loading ? "Загрузка…" : "Загрузить ещё"}
                                    </button>
                                </div>
                            )}
                            {!hasMore && total > 0 && (
                                <div className="text-center text-muted-foreground pt-4">Это все результаты</div>
                            )}
                        </>
                    ) : (
                        !loading && <div className="text-center text-muted-foreground py-16">Ничего не найдено. Измените параметры фильтра.</div>
                    )}
                </div>
            </div>
        </section>
    );
}
