import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export function About() {
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-5xl font-bold text-balance">О компании Eden-stone</h2>
              <p className="text-xl text-muted-foreground text-pretty">
                Более 15 лет мы специализируемся на изготовлении изделий из искусственного камня. За это время мы
                реализовали более 5000 проектов и заслужили доверие тысяч клиентов.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Собственное производство</h4>
                  <p className="text-muted-foreground">Современное оборудование и контроль качества на всех этапах</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Индивидуальный подход</h4>
                  <p className="text-muted-foreground">Учитываем все пожелания клиента и особенности помещения</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Конкурентные цены</h4>
                  <p className="text-muted-foreground">Работаем напрямую с производителями материалов</p>
                </div>
              </div>
            </div>

            <Button size="lg" className="text-lg px-8">
              Узнать больше о нас
            </Button>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
              <img
                src="/modern-stone-manufacturing-workshop.png"
                alt="Производственный цех по обработке искусственного камня"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-card p-6 rounded-xl shadow-lg border">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">довольных клиентов</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
