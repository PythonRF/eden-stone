// components/Hero.tsx
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function Hero() {
    return (
        <section className="relative py-20 lg:py-32 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                                Столешницы из <span className="text-primary">искусственного камня</span> премиум качества
                            </h1>
                            <p className="text-xl text-muted-foreground text-pretty">
                                Изготавливаем кварцевые и акриловые столешницы для кухни, подоконники и другие изделия из искусственного
                                камня. Собственное производство, гарантия качества.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            {/*<Button size="lg" className="text-lg px-8" asChild>*/}
                            {/*    <Link href="/calculate">*/}
                            {/*        Рассчитать стоимость*/}
                            {/*        <ArrowRight className="ml-2 h-5 w-5" />*/}
                            {/*    </Link>*/}
                            {/*</Button>*/}

                            <Link href="/decor" ><Button variant="outline" size="lg" className="text-lg px-8 bg-transparent cursor-pointer">
                                Каталог декоров <ArrowRight className="ml-2 h-5 w-5" />
                            </Button></Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
                            <div className="flex items-center space-x-3">
                                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                                <span className="text-sm">Изготовление до 14 дней*</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                                <span className="text-sm">Гарантия 1 год</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                                <span className="text-sm">Установка в день доставки</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative w-full aspect-[4/3]">
                            <Image
                                src="/modern-kitchen-with-artificial-stone-countertop.jpg"
                                alt="Modern kitchen with artificial stone countertop"
                                fill
                                className="object-cover"
                                sizes="100vw"
                            />
                        </div>
                        <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-lg border">
                            <div className="text-2xl font-bold text-primary">15+</div>
                            <div className="text-sm text-muted-foreground">лет опыта</div>
                        </div>
                        <div className="absolute -top-6 -right-6 bg-card p-6 rounded-xl shadow-lg border">
                            <div className="text-2xl font-bold text-primary">5000+</div>
                            <div className="text-sm text-muted-foreground">проектов</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
