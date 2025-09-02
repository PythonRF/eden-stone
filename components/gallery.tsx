"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const galleryItems = [
  {
    id: 1,
    title: "Кухонная столешница из кварца",
    category: "kitchen",
    image: "/modern-kitchen-quartz-countertop.png",
  },
  {
    id: 2,
    title: "Акриловая столешница с интегрированной мойкой",
    category: "kitchen",
    image: "/acrylic-countertop-integrated-sink.png",
  },
  {
    id: 3,
    title: "Подоконник из искусственного камня",
    category: "windowsill",
    image: "/artificial-stone-window-sill.png",
  },
  {
    id: 4,
    title: "Барная стойка в современном стиле",
    category: "bar",
    image: "/modern-bar-counter-artificial-stone.png",
  },
  {
    id: 5,
    title: "Столешница для ванной комнаты",
    category: "bathroom",
    image: "/bathroom-artificial-stone-countertop.png",
  },
  {
    id: 6,
    title: "Кухонный остров с подсветкой",
    category: "kitchen",
    image: "/kitchen-island-artificial-stone-lighting.png",
  },
]

const categories = [
  { id: "all", name: "Все работы" },
  { id: "kitchen", name: "Кухни" },
  { id: "bathroom", name: "Ванные" },
  { id: "windowsill", name: "Подоконники" },
  { id: "bar", name: "Барные стойки" },
]

export function Gallery() {
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredItems =
    activeCategory === "all" ? galleryItems : galleryItems.filter((item) => item.category === activeCategory)

  return (
    <section id="gallery" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-balance">Наши работы</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Посмотрите на реализованные проекты и убедитесь в качестве нашей работы
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              className="rounded-full"
            >
              {category.name}
            </Button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
