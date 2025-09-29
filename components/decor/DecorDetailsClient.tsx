"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { DecorItem } from "@/lib/decor-data";
import { toStoneType, toSurfaceType } from "@/lib/decor-data";

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
type FacetOption = { value: string; count: number };
type Facets = Record<string, FacetOption[]>;
type ApiResponse = {
    items: ApiDecor[];
    total: number;
    limit: number;
    offset: number;
    facets?: Facets;
};

const PUBLIC_API_BASE =
    process.env.NEXT_PUBLIC_API_BASE || "https://eden.g4m1.biz";

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
        image: d.image ? encodeURI(d.image) : "",
        images: d.images?.map((u) => encodeURI(u)) ?? undefined,
        description: d.description ?? undefined,
    };
}

function getErrorMessage(e: unknown): string {
    if (e instanceof Error) return e.message;
    if (typeof e === "string") return e;
    try {
        return JSON.stringify(e);
    } catch {
        return "Ошибка загрузки";
    }
}

export default function DecorDetailsClient({ slug }: { slug: string }) {
    const [item, setItem] = useState<DecorItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) return;

        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 12000);

        (async () => {
            try {
                setLoading(true);
                setErr(null);

                const qs = new URLSearchParams({
                    limit: "24",
                    offset: "0",
                    q: String(slug),
                }).toString();

                const res = await fetch(`${PUBLIC_API_BASE}/api/v1/decors?${qs}`, {
                    signal: ctrl.signal,
                    cache: "no-store",
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const data = (await res.json()) as ApiResponse;
                const exact = Array.isArray(data.items)
                    ? data.items.find((d) => d.slug === slug)
                    : null;

                if (!exact) {
                    setItem(null);
                    setErr("Не найдено");
                } else {
                    setItem(mapApiDecor(exact));
                }
            } catch (e: unknown) {
                setErr(getErrorMessage(e));
                setItem(null);
            } finally {
                clearTimeout(timer);
                setLoading(false);
            }
        })();

        return () => {
            ctrl.abort();
            clearTimeout(timer);
        };
    }, [slug]);

    if (loading) {
        return (
            <section className="container mx-auto px-4 py-10 lg:py-14">
                <div className="mb-6">
                    <Link href="/decor" className="text-sm text-muted-foreground hover:underline">
                        ← Назад в каталог
                    </Link>
                </div>
                <p className="text-muted-foreground">Загрузка…</p>
            </section>
        );
    }

    if (err || !item) {
        return (
            <section className="container mx-auto px-4 py-10 lg:py-14">
                <div className="mb-6">
                    <Link href="/decor" className="text-sm text-muted-foreground hover:underline">
                        ← Назад в каталог
                    </Link>
                </div>
                <h1 className="text-2xl font-semibold mb-2">Не удалось загрузить декор</h1>
                <p className="text-sm text-muted-foreground">{err || "Не найдено"}</p>
            </section>
        );
    }

    return (
        <section className="container mx-auto px-4 py-10 lg:py-14">
            <div className="mb-6">
                <Link href="/decor" className="text-sm text-muted-foreground hover:underline">
                    ← Назад в каталог
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7">
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden border">
                        {item.image ? (
                            <Image
                                src={item.image}
                                alt={`${item.name}${item.code ? ` (${item.code})` : ""}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full bg-muted" />
                        )}
                    </div>

                    {item.images && item.images.length > 1 ? (
                        <div className="mt-3 grid grid-cols-4 gap-3">
                            {item.images.slice(1).map((img, idx) => (
                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border">
                                    <Image
                                        src={img}
                                        alt={`${item.name} preview ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="25vw"
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>

                <div className="lg:col-span-5 space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold leading-tight">{item.name}</h1>
                        <div className="text-muted-foreground">
                            {item.code ? `Код: ${item.code}` : "Код не указан"}
                        </div>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div>
                            <span className="text-muted-foreground">Бренд:</span> {item.brand}
                        </div>
                        <div className="capitalize">
                            <span className="text-muted-foreground">Тип камня:</span> {item.stoneType}
                        </div>
                        <div className="capitalize">
                            <span className="text-muted-foreground">Поверхность:</span> {item.surface}
                        </div>
                        <div>
                            <span className="text-muted-foreground">Цена:</span>{" "}
                            <strong>{item.price.toLocaleString()} ₽/м²</strong>
                        </div>
                    </div>

                    {item.description ? <p className="text-muted-foreground">{item.description}</p> : null}

                    <div className="p-2 inline-flex items-center justify-center px-8 h-10 rounded-md border bg-primary text-primary-foreground hover:opacity-90">
                        Рассчитать стоимость
                    </div>
                </div>
            </div>
        </section>
    );
}
