// app/calculate/[slug]/stone/page.tsx
"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"

// Пример каталога камней (можно хранить в отдельном файле /data/stones.ts)
const stones = [
    {
        title: "Quartz White",
        image: "/stones/quartz-white.jpg",
        description: "Белый кварцевый камень, идеально подходит для современных интерьеров.",
        popular: true,
    },
    {
        title: "Quartz Black",
        image: "/stones/quartz-black.jpg",
        description: "Глубокий черный кварц с элегантным блеском.",
    },
    {
        title: "Acrylic Sand",
        image: "/stones/acrylic-sand.jpg",
        description: "Акриловый камень с тёплым песочным оттенком.",
    },
    {
        title: "Acrylic Snow",
        image: "/stones/acrylic-snow.jpg",
        description: "Светлый акриловый камень, идеально для классических интерьеров.",
    },
]

export default function StoneSelectionPage() {
    const { slug } = useParams()

    return (
        <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4">
                {/* Навигация */}
                <div className="mb-10 lg:mb-14">
                    <div className="text-sm text-muted-foreground mb-2">
                        <Link href="/" className="hover:text-foreground transition-colors">Главная</Link>
                        <span className="mx-2">/</span>
                        <Link href="/calculate" className="hover:text-foreground transition-colors">Рассчитать стоимость</Link>
                        <span className="mx-2">/</span>
                        <span className="text-foreground capitalize">{slug}</span>
                        <span className="mx-2">/</span>
                        <span className="text-foreground">Выбор камня</span>
                    </div>
                    <h1 className="text-3xl lg:text-5xl font-bold">Выберите камень</h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
                        Подберите материал и цвет из нашего каталога, чтобы перейти к расчёту стоимости.
                    </p>
                </div>

                {/* Грид камней */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {stones.map((stone, i) => (
                        <Link key={i} href={`/calculate/${slug}/stone/${stone.title.toLowerCase().replace(/\s+/g, "-")}`}>
                            <Card className="group hover:shadow-lg transition-shadow duration-300 h-full">
                                <CardContent className="p-0">
                                    <div className="relative">
                                        <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                                            <img
                                                src={stone.image}
                                                alt={stone.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        {stone.popular && (
                                            <Badge className="absolute top-4 left-4 bg-primary">Популярно</Badge>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h2 className="text-lg font-semibold mb-2">{stone.title}</h2>
                                        <p className="text-sm text-muted-foreground mb-4">{stone.description}</p>
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
            </div>
        </section>
    )
}
