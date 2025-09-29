import type React from "react"
import {Suspense} from "react"
import type {Metadata} from "next"
import {GeistSans} from "geist/font/sans"
import {GeistMono} from "geist/font/mono"
import {Analytics} from "@vercel/analytics/next"
import "./globals.css"
import {Header} from "@/components/header";

export const metadata: Metadata = {
  title: "Столешницы из искусственного камня | Изделия из кварца и акрила",
  description:
    "Изготовление столешниц для кухни, подоконников и изделий из искусственного камня. Кварцевые и акриловые поверхности высокого качества. Замер, изготовление, установка.",
  keywords:
    "столешницы из искусственного камня, кварцевые столешницы, акриловые столешницы, подоконники из камня, изделия из искусственного камня, столешницы для кухни",
  generator: "v0.app",
  openGraph: {
    title: "Столешницы из искусственного камня | Изделия из кварца и акрила",
    description:
      "Изготовление столешниц для кухни, подоконников и изделий из искусственного камня. Кварцевые и акриловые поверхности высокого качества.",
    type: "website",
    locale: "ru_RU",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
      <Header />
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
