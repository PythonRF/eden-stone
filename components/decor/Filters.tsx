// app/components/decor/Filters.tsx
"use client";

import { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Filter, X } from "lucide-react";
import type { StoneType, SurfaceType } from "@/lib/decor-data";
import {Separator} from "@radix-ui/react-select";
import {Accordion,  AccordionContent, AccordionItem, AccordionTrigger} from "../ui/accordion";
import { ScrollArea } from "../ui/scroll-area";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "../ui/sheet";

export type FiltersState = {
    stoneTypes: StoneType[];
    brands: string[];
    surfaces: SurfaceType[];
};

export const defaultFilters: FiltersState = {
    stoneTypes: [],
    brands: [],
    surfaces: [],
};

type FiltersBaseProps = {
    values: FiltersState;
    onChange: (v: FiltersState) => void;
    allBrands: string[];
    allStoneTypes: StoneType[];
    allSurfaces: SurfaceType[];
};

type FiltersProps = FiltersBaseProps & {
    // режим отрисовки: "panel" (вставляем в колонку) или "sheet" (мобильная панель)
    mode?: "panel" | "sheet";
    // полезно, чтобы показать к-во найденных
    resultCount?: number;
};

export function DecorFilters(props: FiltersProps) {
    const { mode = "panel" } = props;
    if (mode === "sheet") return <MobileFilters {...props} />;
    return <FiltersPanel {...props} />;
}

/* =======================
   Общая панель фильтров
   ======================= */
function FiltersPanel({
                          values,
                          onChange,
                          allBrands,
                          allStoneTypes,
                          allSurfaces,
                          resultCount,
                      }: FiltersBaseProps & { resultCount?: number }) {
    const hasAny = values.stoneTypes.length > 0 || values.brands.length > 0 || values.surfaces.length > 0;

    const toggle = <T extends string>(key: keyof FiltersState, val: T) => {
        const list = (values[key] as T[]) || [];
        const next = list.includes(val) ? list.filter((v) => v !== val) : [...list, val];
        onChange({ ...values, [key]: next });
    };

    const clear = () => onChange(defaultFilters);

    // Поиск по брендам
    const [brandQuery, setBrandQuery] = useState("");
    const filteredBrands = useMemo(() => {
        const q = brandQuery.trim().toLowerCase();
        if (!q) return allBrands;
        return allBrands.filter((b) => b.toLowerCase().includes(q));
    }, [brandQuery, allBrands]);

    // На маленьких экранах показываем меньше элементов, но это контролирует контейнер
    return (
        <aside className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Фильтры</h3>
                {hasAny ? (
                    <Button size="sm" variant="ghost" onClick={clear} className="h-8 px-2">
                        Сбросить
                    </Button>
                ) : null}
            </div>

            {/* Выбранные чипсы */}
            {hasAny && (
                <div className="flex flex-wrap gap-2">
                    {values.stoneTypes.map((t) => (
                        <Badge key={t} variant="secondary" className="gap-1">
                            {t}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => toggle("stoneTypes", t)} />
                        </Badge>
                    ))}
                    {values.brands.map((b) => (
                        <Badge key={b} variant="secondary" className="gap-1">
                            {b}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => toggle("brands", b)} />
                        </Badge>
                    ))}
                    {values.surfaces.map((s) => (
                        <Badge key={s} variant="secondary" className="gap-1">
                            {s}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => toggle("surfaces", s)} />
                        </Badge>
                    ))}
                </div>
            )}

            <Separator />

            {/* Аккордеоны */}
            <Accordion type="multiple" defaultValue={["stone", "brand", "surface"]} className="w-full">
                {/* Тип камня */}
                <AccordionItem value="stone" className="border-none">
                    <AccordionTrigger className="py-2 text-sm font-medium">Тип камня</AccordionTrigger>
                    <AccordionContent className="pt-1 space-y-2">
                        {allStoneTypes.map((t) => (
                            <label key={t} className="flex items-center gap-3">
                                <Checkbox checked={values.stoneTypes.includes(t)} onCheckedChange={() => toggle("stoneTypes", t)} />
                                <span className="text-sm">{t}</span>
                            </label>
                        ))}
                    </AccordionContent>
                </AccordionItem>

                {/* Бренд */}
                <AccordionItem value="brand" className="border-none">
                    <AccordionTrigger className="py-2 text-sm font-medium">Бренд</AccordionTrigger>
                    <AccordionContent className="pt-1 space-y-3">
                        <Input
                            value={brandQuery}
                            onChange={(e) => setBrandQuery(e.target.value)}
                            placeholder="Поиск бренда…"
                            className="h-9"
                        />
                        <ScrollArea className="h-56 pr-2">
                            <div className="space-y-2">
                                {filteredBrands.length ? (
                                    filteredBrands.map((b) => (
                                        <label key={b} className="flex items-center gap-3">
                                            <Checkbox checked={values.brands.includes(b)} onCheckedChange={() => toggle("brands", b)} />
                                            <span className="text-sm">{b}</span>
                                        </label>
                                    ))
                                ) : (
                                    <div className="text-xs text-muted-foreground">Ничего не найдено</div>
                                )}
                            </div>
                        </ScrollArea>
                        {values.brands.length > 0 && (
                            <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => onChange({ ...values, brands: [] })}>
                                Очистить бренды
                            </Button>
                        )}
                    </AccordionContent>
                </AccordionItem>

                {/* Поверхность */}
                <AccordionItem value="surface" className="border-none">
                    <AccordionTrigger className="py-2 text-sm font-medium">Поверхность</AccordionTrigger>
                    <AccordionContent className="pt-1 space-y-2">
                        {allSurfaces.map((s) => (
                            <label key={s} className="flex items-center gap-3">
                                <Checkbox checked={values.surfaces.includes(s)} onCheckedChange={() => toggle("surfaces", s)} />
                                <span className="text-sm">{s}</span>
                            </label>
                        ))}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <div className="pt-2">
                <Button className="w-full" variant="default">
                    Показать{typeof resultCount === "number" ? ` (${resultCount})` : ""}
                </Button>
            </div>
        </aside>
    );
}

/* =======================
   Мобильная версия — Sheet
   ======================= */
function MobileFilters({
                           values,
                           onChange,
                           allBrands,
                           allStoneTypes,
                           allSurfaces,
                           resultCount,
                       }: FiltersBaseProps & { resultCount?: number }) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-2">
                    <Filter className="h-4 w-4" />
                    Фильтры {values.stoneTypes.length + values.brands.length + values.surfaces.length ? "•" : ""}
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[88%] sm:w-[420px] p-0">
                <SheetHeader className="px-4 py-3 border-b">
                    <SheetTitle>Фильтры</SheetTitle>
                </SheetHeader>

                <div className="p-4">
                    <FiltersPanel
                        values={values}
                        onChange={onChange}
                        allBrands={allBrands}
                        allStoneTypes={allStoneTypes}
                        allSurfaces={allSurfaces}
                        resultCount={resultCount}
                    />
                </div>

                <SheetFooter className="p-4 border-t flex items-center gap-2">
                    <Button variant="ghost" className="flex-1" onClick={() => onChange(defaultFilters)}>
                        Сбросить
                    </Button>
                    <SheetClose asChild>
                        <Button className="flex-1">Показать{typeof resultCount === "number" ? ` (${resultCount})` : ""}</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
