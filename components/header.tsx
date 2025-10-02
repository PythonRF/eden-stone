"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const pathname = usePathname()
    const isDecor = pathname?.startsWith("/decor")

    // форма
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [prefWhatsApp, setPrefWhatsApp] = useState(false)
    const [consent, setConsent] = useState(false)
    const [extra, setExtra] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [err, setErr] = useState<string | null>(null)


    const [kitchen, setKitchen] = useState(false)
    const [bath, setBath] = useState(false)


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

    const openDialog = () => setIsDialogOpen(true)
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

                    {/* Contact Info (видна на lg+) */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-sm">
                            <Phone className="h-4 w-4 text-primary" />
                            <span>+7 (925) 724-49-95</span>
                        </div>

                        {/* Триггер диалога */}
                        <Button onClick={openDialog}>Заказать звонок</Button>
                    </div>
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
                                <Button className="w-full" onClick={openDialog}>Заказать звонок</Button>
                            </div>
                        </div>
                    </nav>
                )}
            </div>

            {/* Модальное окно */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                {/* Можно было бы использовать DialogTrigger, но мы управляем состоянием вручную из двух кнопок */}
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader>
                        <DialogTitle>Заказать звонок</DialogTitle>
                        <DialogDescription>
                            Оставьте контакты — мы перезвоним и ответим на вопросы.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="grid gap-3">
                            <div className="grid gap-1.5">
                                <Label htmlFor="phone">Телефон *</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    inputMode="tel"
                                    placeholder="+7 900 000-00-00"
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Место установки</Label>
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-2">
                                        <Checkbox checked={kitchen} onCheckedChange={(v) => setKitchen(Boolean(v))} />
                                        <span className="text-sm">Кухня</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <Checkbox checked={bath} onCheckedChange={(v) => setBath(Boolean(v))} />
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
                                    className='border-green-700'
                                    onChange={(e) => setExtra(e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Опции</Label>
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-2">
                                        <Checkbox checked={prefWhatsApp} onCheckedChange={(v) => setPrefWhatsApp(Boolean(v))} />
                                        <span className="text-sm">Предпочитаю WhatsApp</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <Checkbox checked={consent} onCheckedChange={(v) => setConsent(Boolean(v))} />
                                        <span className="text-sm">
                      Согласен с обработкой персональных данных *
                    </span>
                                    </label>
                                </div>
                            </div>



                            {err && <p className="text-sm text-red-500">{err}</p>}
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeDialog}
                                disabled={submitting}
                            >
                                Отмена
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? "Отправляем…" : "Отправить заявку"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </header>
    )
}
