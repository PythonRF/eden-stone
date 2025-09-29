import { Card, CardContent } from "@/components/ui/card"
import {Ruler, Truck, Shield, Clock, Users, Award, MessageCircle} from "lucide-react"

const features = [
    {
        icon: MessageCircle,
        title: "Бесплатная консультация",
        description: "Помогаем подобрать оптимальное решение из искусственного камня и отвечаем на все ваши вопросы бесплатно",
    },
  {
    icon: Clock,
    title: "Быстрое изготовление",
    description: "Изготавливаем изделия в срок от 3 до 14 рабочих дней в зависимости от сложности",
  },
  {
    icon: Truck,
    title: "Доставка и установка",
    description: "Доставляем и устанавливаем изделия силами наших специалистов",
  },
  {
    icon: Shield,
    title: "Гарантия качества",
    description: "Предоставляем гарантию на все изделия сроком до 10 лет",
  },
  {
    icon: Users,
    title: "Опытная команда",
    description: "Наши мастера имеют опыт работы более 15 лет в сфере обработки камня",
  },
  {
    icon: Award,
    title: "Сертифицированные материалы",
    description: "Используем только качественные материалы от проверенных производителей",
  },
]

export function Features() {
  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-balance">Почему выбирают нас</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Мы предлагаем полный цикл услуг от замера до установки готового изделия
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center group hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
