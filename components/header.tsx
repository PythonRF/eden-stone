"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone } from "lucide-react"

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathname = usePathname()
    const isDecor = pathname?.startsWith("/decor")

    return (
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* ЛОГО — всегда показываем */}
                    <div className="flex items-center space-x-4">
                        <Link href="/">
                            <h1 className="text-xl font-bold text-primary">Eden-stone</h1>
                        </Link>
                    </div>
                    <div className="hidden lg:flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-sm">
                            <Phone className="h-4 w-4 text-primary" />
                            <span>+7 (925) 724-49-95</span>
                        </div>
                        <Button>Заказать звонок</Button>
                    </div>

                    {/* Всё остальное скрываем на /decor */}
                    {!isDecor && (
                        <>
                            {/* Desktop Navigation */}
                            <nav className="hidden md:flex items-center space-x-8">
                                <a href="#products" className="text-foreground hover:text-primary transition-colors">
                                    Проекты
                                </a>
                                <Link href="/decor" className="text-foreground hover:text-primary transition-colors">
                                    Каталог декоров
                                </Link>
                                <a href="#services" className="text-foreground hover:text-primary transition-colors">
                                    Услуги
                                </a>
                                <a href="#gallery" className="text-foreground hover:text-primary transition-colors">
                                    Галерея
                                </a>
                                <a href="#about" className="text-foreground hover:text-primary transition-colors">
                                    О нас
                                </a>
                                <a href="#contact" className="text-foreground hover:text-primary transition-colors">
                                    Контакты
                                </a>
                            </nav>

                            {/* Contact Info */}
                            <div className="hidden lg:flex items-center space-x-4">
                                <div className="flex items-center space-x-2 text-sm">
                                    <Phone className="h-4 w-4 text-primary" />
                                    <span>+7 (925) 724-49-95</span>
                                </div>
                                <Button>Заказать звонок</Button>
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                className="md:hidden"
                                aria-label="Открыть меню"
                                onClick={() => setIsMenuOpen((v) => !v)}
                            >
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Navigation */}
                {!isDecor && isMenuOpen && (
                    <nav className="md:hidden py-4 border-t">
                        <div className="flex flex-col space-y-4">
                            <a href="#products" className="text-foreground hover:text-primary transition-colors">
                                Продукция
                            </a>
                            <a href="#services" className="text-foreground hover:text-primary transition-colors">
                                Услуги
                            </a>
                            <a href="#gallery" className="text-foreground hover:text-primary transition-colors">
                                Галерея
                            </a>
                            <a href="#about" className="text-foreground hover:text-primary transition-colors">
                                О нас
                            </a>
                            <a href="#contact" className="text-foreground hover:text-primary transition-colors">
                                Контакты
                            </a>
                            <div className="pt-4 border-t">
                                <div className="flex items-center space-x-2 text-sm mb-4">
                                    <Phone className="h-4 w-4 text-primary" />
                                    <span>+7 (495) 123-45-67</span>
                                </div>
                                <Button className="w-full">Заказать звонок</Button>
                            </div>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    )
}
