// ~/lib/decor-data.ts

// ---- Типы каталога ----
export type StoneType =
    | "Акрил"
    | "Кварц"
    | "Гранит"
    | "Керамогранит"
    | "Мрамор"
    | "Кварцит";

export type SurfaceType =
    | "Глянцевая"
    | "Матовая";

// ---- Модель ----
export type DecorItem = {
    id: string;
    slug: string;
    name: string;
    code: string;
    brand: string;
    stoneType: StoneType;
    surface: SurfaceType;
    price: number;      // цена за м²
    createdAt: string;  // ISO дата
    image: string;      // основное изображение
    images?: string[];  // галерея
    description?: string;
};

// ---- Совместимость со старыми импортами (моки) ----
export const DECOR_ITEMS: DecorItem[] = [];
export const ALL_BRANDS: string[] = [];

// Базовые списки (строгие)
export const ALL_STONE_TYPES: readonly StoneType[] = [
    "Акрил",
    "Кварц",
    "Гранит",
    "Керамогранит",
    "Мрамор",
    "Кварцит",
] as const;

export const ALL_SURFACES: readonly SurfaceType[] = [
    "Глянцевая",
    "Матовая",
] as const;

// ---- Нормализация входящих значений из API ----
// Синонимы/вариации → к твоим строгим значениям.
const STONE_ALIASES: Record<string, StoneType> = {
    // точные
    "Акрил": "Акрил",
    "Кварц": "Кварц",
    "Гранит": "Гранит",
    "Керамогранит": "Керамогранит",
    "Мрамор": "Мрамор",
    "Кварцит": "Кварцит",

    // частые варианты (если появятся)
    "Quartz": "Кварц",
    "Кварцевый агломерат": "Кварц",
};

const SURFACE_ALIASES: Record<string, SurfaceType> = {
    // то, что часто приходит с бэка
    "Глянец": "Глянцевая",
    "Мат": "Матовая",

    // точные значения
    "Глянцевая": "Глянцевая",
    "Матовая": "Матовая",
};

// Приведение строк из API к строгим union-типам.
// При неизвестном значении возвращаем безопасный дефолт.
export function toStoneType(v: string): StoneType {
    const key = (v ?? "").trim();
    if ((ALL_STONE_TYPES as readonly string[]).includes(key)) {
        return key as StoneType;
    }
    if (STONE_ALIASES[key]) return STONE_ALIASES[key];
    // fallback: выбери, что логичнее для твоего каталога
    return "Кварц";
}

export function toSurfaceType(v: string): SurfaceType {
    const key = (v ?? "").trim();
    if ((ALL_SURFACES as readonly string[]).includes(key)) {
        return key as SurfaceType;
    }
    if (SURFACE_ALIASES[key]) return SURFACE_ALIASES[key];
    // fallback
    return "Глянцевая";
}
