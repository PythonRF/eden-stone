// utils/slugify.ts
import slugifyLib from "slugify"

export function slugify(text: string) {
    return slugifyLib(text, {
        lower: true,
        strict: true, // убирает лишние символы
        locale: "ru", // поддержка кириллицы
    })
}
