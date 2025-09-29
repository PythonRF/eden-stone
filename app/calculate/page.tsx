// app/calculate/page.tsx
"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { useMemo } from "react"

type Product = {
    title: string
    description: string
    image: string
    features: string[]
    popular?: boolean
    slug: string
}

const products: Product[] = [
    {
        title: "Кварцевые столешницы",
        description:
            "Прочные и долговечные столешницы из кварцевого агломерата. Устойчивы к царапинам, пятнам и высоким температурам.",
        image: "/quartz-kitchen-countertop.jpg",
        features: ["Прочность", "Гигиеничность", "Разнообразие цветов"],
        popular: true,
        slug: "quartz-kitchen-countertop",
    },
    {
        title: "Барные стойки",
        description:
            "Стильные барные стойки и островки для кухни. Создают уютную атмосферу и функциональное пространство.",
        image: "/artificial-stone-bar-counter.jpg",
        features: ["Стильный дизайн", "Функциональность", "Прочность"],
        popular: true,
        slug: "artificial-stone-bar-counter",
    },
    {
        title: "Акриловые мойки",
        description:
            "Современные акриловые мойки для кухни или ванной комнаты. Отличаются стильным внешним видом, простотой ухода и долговечностью.",
        image: "/acryril-umiv.jpg",
        features: ["Эстетичный дизайн", "Устойчивость к повреждениям", "Легкость в уходе"],
        popular: true,
        slug: "acryril-umiv.acryril-umi",
    },
    {
        title: "Акриловые столешницы",
        description:
            "Бесшовные столешницы из акрилового камня. Легко восстанавливаются, подходят для сложных форм.",
        image: "/acrylic-kitchen-countertop.jpg",
        features: ["Бесшовность", "Ремонтопригодность", "Любые формы"],
        slug: "acrylic-kitchen-countertop",
    },
    {
        title: "Подоконники",
        description:
            "Элегантные подоконники из искусственного камня. Влагостойкие, легко моются, долговечные.",
        image: "/artificial-stone-window-sill.jpg",
        features: ["Влагостойкость", "Простота ухода", "Эстетичность"],
        slug: "artificial-stone-window-sill",
    },
    {
        title: "Кварцевые ступени",
        description:
            "Надёжные и элегантные кварцевые ступени. Обеспечивают долговечность, устойчивость к нагрузкам и стильный внешний вид.",
        image: "/quartz-steps.jpg",
        features: ["Высокая прочность", "Износостойкость", "Эстетика и комфорт"],
        slug: "quartz-steps",
    },
    {
        title: "Уникальный дизайн",
        description:
            "Индивидуальные решения из искусственного камня под любую задумку. Подчеркнут стиль интерьера и обеспечат эксклюзивность.",
        image: "/custom-artificial-stone.jpg",
        features: ["Персональный подход", "Широкий выбор форм и оттенков", "Эксклюзивность"],
        slug: "custom-artificial-stone",
    },
    {
        title: "Кофейные столики из кварца",
        description:
            "Элегантные кофейные столики из кварца. Совмещают стильный дизайн, прочность и удобство в использовании.",
        image: "/quartz-coffee-table.jpg",
        features: ["Современный дизайн", "Устойчивость к повреждениям", "Долговечность"],
        slug: "quartz-coffee-table",
    },
]

// простой slug из заголовка
function slugify(s: string) {
    return s
        .toLowerCase()
        .replace(/ё/g, "e")
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/^-+|-+$/g, "")
}

export default function CalculatePage() {
    const items = useMemo(
        () =>
            products.map((p) => ({
                ...p,
                slug: slugify(p.slug),
            })),
        []
    )

    return (
        <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4">
                {/* Заголовок */}
                <div className="mb-10 lg:mb-14">
                    <div className="text-sm text-muted-foreground mb-2">
                        <Link href="/" className="hover:text-foreground transition-colors">Главная</Link>
                        <span className="mx-2">/</span>
                        <span className="text-foreground">Рассчитать стоимость</span>
                    </div>
                    <h1 className="text-3xl lg:text-5xl font-bold text-balance">Выберите изделие для расчёта</h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
                        Выберите тип изделия из искусственного камня. На следующем шаге мы уточним размеры, материал, кромки и
                        дополнительные опции.
                    </p>
                </div>

                {/* Грид с карточками */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((product) => (
                        <Link
                            key={product.slug}
                            href={`/calculate/${product.slug}/stone`}
                            className="group"
                        >
                            <Card className="h-full group-hover:shadow-lg transition-shadow duration-300">
                                <CardContent className="p-0">
                                    <div className="relative">
                                        <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                                            <img
                                                src={product.image || "/placeholder.svg"}
                                                alt={product.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                loading="lazy"
                                            />
                                        </div>
                                        {product.popular && (
                                            <Badge className="absolute top-4 left-4 bg-primary">Популярно</Badge>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
                                        <p className="text-sm text-muted-foreground mb-4">{product.description}</p>

                                        <div className="space-y-2 mb-5">
                                            {product.features.map((f, i) => (
                                                <div key={i} className="flex items-center text-sm">
                                                    <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0" />
                                                    <span>{f}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <Button variant="secondary" className="w-full justify-between">
                                            Выбрать
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Подсказка/примечание */}
                <div className="mt-10 text-sm text-muted-foreground">
                    * Сроки изготовления зависят от сложности изделия и выбранного материала.
                </div>
            </div>
        </section>
    )
}
