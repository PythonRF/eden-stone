import { Phone, Mail, MapPin } from "lucide-react"
import type React from "react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary-foreground">Eden-stone</h3>
            <p className="text-sm opacity-80">
              Изготовление изделий из искусственного камня высочайшего качества. Более 15 лет опыта и тысячи довольных
              клиентов.
            </p>
          </div>

          <div className="space-y-4">

          </div>

          <div className="space-y-4">

          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-primary-foreground">Контакты</h4>
            <div className="space-y-3 text-sm opacity-80">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                  <a href="tel:+79257244995"><span>+7 (925) 724-49-95</span></a>
                  <a href="tel:+79254281612"><span>+7 (925) 428-16-12</span></a>

              </div>
              <div className="flex items-center space-x-2">
                  <a href="mailto:zakaz@eden-stone.ru" className="flex"><Mail className="h-4 w-4 mr-2 mt-0.5" />
                      <span>zakaz@eden-stone.ru</span></a>

              </div>
              <div className="flex items-start space-x-2">
                <a href="https://yandex.ru/maps/-/CLRzmKjF" className="flex"><MapPin className="h-4 w-4 mt-0.5 mr-2" />
                    <span>г.Реутов, ул.Проспект мира, д26</span></a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-sm opacity-60">
          <p>&copy; 2025 Eden-stone. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
