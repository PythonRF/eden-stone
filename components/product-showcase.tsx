import {Card, CardContent} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"

const products = [
  {
    title: "Кварцевые столешницы",
    description:
      "Прочные и долговечные столешницы из кварцевого агломерата. Устойчивы к царапинам, пятнам и высоким температурам.",
    image: "/quartz-kitchen-countertop.jpg",
    features: ["Прочность", "Гигиеничность", "Разнообразие цветов"],
    popular: true,
  },
    {
        title: "Барные стойки",
        description: "Стильные барные стойки и островки для кухни. Создают уютную атмосферу и функциональное пространство.",
        image: "/artificial-stone-bar-counter.jpg",
        features: ["Стильный дизайн", "Функциональность", "Прочность"],
        popular: true,
    },
    {
        title: "Акриловые мойки",
        description: "Современные акриловые мойки для кухни или ванной комнаты. Отличаются стильным внешним видом, простотой ухода и долговечностью.",
        image: "/acryril-umiv.jpg",
        features: ["Эстетичный дизайн", "Устойчивость к повреждениям", "Легкость в уходе"],
        popular: true,
    },
  {
    title: "Акриловые столешницы",
    description: "Бесшовные столешницы из акрилового камня. Легко восстанавливаются, подходят для сложных форм.",
    image: "/acrylic-kitchen-countertop.jpg",
    features: ["Бесшовность", "Ремонтопригодность", "Любые формы"],
  },
  {
    title: "Подоконники",
    description: "Элегантные подоконники из искусственного камня. Влагостойкие, легко моются, долговечные.",
    image: "/artificial-stone-window-sill.jpg",
    features: ["Влагостойкость", "Простота ухода", "Эстетичность"],
  },
    {
        title: "Кварцевые ступени",
        description: "Надёжные и элегантные кварцевые ступени. Обеспечивают долговечность, устойчивость к нагрузкам и стильный внешний вид.",
        image: "/quartz-steps.jpg",
        features: ["Высокая прочность", "Износостойкость", "Эстетика и комфорт"],
    },
    {
        title: "Уникальный дизайн",
        description: "Индивидуальные решения из искусственного камня под любую задумку. Подчеркнут стиль интерьера и обеспечат эксклюзивность.",
        image: "/custom-artificial-stone.jpg",
        features: ["Персональный подход", "Широкий выбор форм и оттенков", "Эксклюзивность"],
    },
    {
        title: "Кофейные столики из кварца",
        description: "Элегантные кофейные столики из кварца. Совмещают стильный дизайн, прочность и удобство в использовании.",
        image: "/quartz-coffee-table.jpg",
        features: ["Современный дизайн", "Устойчивость к повреждениям", "Долговечность"],
    }




]

export function ProductShowcase() {
  return (
    <section id="products" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-balance">Наши проекты</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Широкий ассортимент изделий из искусственного камня для вашего дома и офиса или бизнеса
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <Card key={index} className="group hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {product.popular && <Badge className="absolute top-4 left-4 bg-primary">Популярно</Badge>}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{product.title}</h3>
                  <p className="text-muted-foreground mb-4 text-sm">{product.description}</p>
                  <div className="space-y-2">
                    {product.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
