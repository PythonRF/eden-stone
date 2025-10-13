"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { DecorItem } from "@/lib/decor-data";
import { toStoneType, toSurfaceType } from "@/lib/decor-data";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Checkbox} from "@/components/ui/checkbox";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";

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
    process.env.NEXT_PUBLIC_API_BASE || "https://eden-stone.ru";

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
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [item, setItem] = useState<DecorItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);


    // форма
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [prefWhatsApp, setPrefWhatsApp] = useState(false)
    const [consent, setConsent] = useState(false)
    const [extra, setExtra] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const resetForm = () => {
        setPhone("")
        setEmail("")
        setPrefWhatsApp(false)
        setKitchen(false)
        setBath(false)
        setConsent(false)
        setExtra("")
        setErr(null)
    }
    const [kitchen, setKitchen] = useState(false)
    const [bath, setBath] = useState(false)

    // const openDialog = () => setIsDialogOpen(true)
    const closeDialog = () => {
        setIsDialogOpen(false)
        // не очищаем моментально, чтобы пользователь мог повторно открыть и поправить;
        // очистим при успешной отправке
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErr(null)

        // простая валидация
        if (!phone.trim()) {
            setErr("Укажите номер телефона")
            return
        }
        if (!consent) {
            setErr("Нужно согласиться с обработкой данных")
            return
        }
        // опциональная валидация email
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setErr("Некорректный email")
            return
        }

        setSubmitting(true)
        try {
            // TODO: сюда вставь свой запрос
            // пример:
            await fetch("https://eden-stone.ru/api/v1/callback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, email, prefWhatsApp, bath, kitchen, extra }),
            })

            // имитация
            await new Promise((r) => setTimeout(r, 600))

            resetForm()
            setIsDialogOpen(false)
        } catch {
            setErr("Не удалось отправить заявку")
        } finally {
            setSubmitting(false)
        }
    }

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

                    <button
                        type="button"
                        onClick={() => setIsDialogOpen(true)}
                        className="p-2 inline-flex items-center justify-center px-8 h-10 rounded-md border bg-primary text-primary-foreground hover:opacity-90"
                        aria-haspopup="dialog"
                    >
                        Рассчитать стоимость
                    </button>
                </div>
            </div>
            <Dialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            >
                <DialogContent
                    // ⛔️ не даём Safari авто-прокрутить к первому input
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    className="
      p-0
      w-[min(100vw-16px,520px)]
      sm:max-w-[520px]
      max-h-[calc(100dvh-16px)]  /* динамический вьюпорт против клавы */
      overflow-hidden            /* скроллим внутреннюю колонку */
      supports-[height:100dvh]:max-h-[calc(100dvh-16px)]
      rounded-xl
    "
                >
                    <div className="flex flex-col max-h-inherit"> {/* колонка на всю высоту */}
                        <DialogHeader className="p-4 sticky top-0 bg-background z-10 border-b">
                            <DialogTitle>Заказать звонок</DialogTitle>
                            <DialogDescription>
                                Оставьте контакты — мы перезвоним и ответим на вопросы.
                            </DialogDescription>
                        </DialogHeader>

                        {/* Прокручиваемая середина */}
                        <div className="px-4 py-3 overflow-y-auto overscroll-contain grow">
                            <form onSubmit={onSubmit} className="space-y-4">
                                <div className="grid gap-3">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="phone">Телефон *</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            inputMode="tel"
                                            placeholder="+7 900 000-00-00"
                                            className="border-[#006C36] text-base" /* ≥16px, чтобы iOS не зумил */
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            className="border-[#006C36] text-base"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Место установки</Label>
                                        <div className="flex flex-col gap-2">
                                            <label className="flex items-center gap-2">
                                                <Checkbox
                                                    className="border-[#006C36] cursor-pointer"
                                                    checked={kitchen}
                                                    onCheckedChange={(v) => setKitchen(Boolean(v))}
                                                />
                                                <span className="text-sm">Кухня</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <Checkbox
                                                    className="border-[#006C36] cursor-pointer"
                                                    checked={bath}
                                                    onCheckedChange={(v) => setBath(Boolean(v))}
                                                />
                                                <span className="text-sm">Ванная</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label htmlFor="extra">Дополнительная информация</Label>
                                        <Textarea
                                            id="extra"
                                            placeholder="Опишите удобное время, вопрос по материалу и т.п."
                                            rows={4}
                                            value={extra}
                                            className="border-green-700 text-base"
                                            onChange={(e) => setExtra(e.target.value)}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Опции</Label>
                                        <div className="flex flex-col gap-2">
                                            <label className="flex items-center gap-2">
                                                <Checkbox
                                                    className="border-[#006C36] cursor-pointer"
                                                    checked={prefWhatsApp}
                                                    onCheckedChange={(v) => setPrefWhatsApp(Boolean(v))}
                                                />
                                                <span className="text-sm">Предпочитаю WhatsApp</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <Checkbox
                                                    className="border-[#006C36] cursor-pointer"
                                                    checked={consent}
                                                    onCheckedChange={(v) => setConsent(Boolean(v))}
                                                />
                                                <span className="text-sm">
                    Согласен с обработкой персональных данных *
                  </span>
                                            </label>
                                        </div>
                                    </div>

                                    {err && <p className="text-sm text-red-500">{err}</p>}
                                </div>

                                {/* Футер делаем отдельным sticky ниже */}
                            </form>
                        </div>

                        {/* Фиксированный футер с кнопками */}
                        <DialogFooter className="p-4 sticky bottom-0 bg-background border-t gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeDialog}
                                disabled={submitting}
                            >
                                Отмена
                            </Button>
                            <Button formAction="submit" disabled={submitting} onClick={onSubmit}>
                                {submitting ? "Отправляем…" : "Отправить заявку"}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
}
