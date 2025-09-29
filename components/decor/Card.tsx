import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DecorItem } from "@/lib/decor-data";

export function DecorCard({ item }: { item: DecorItem }) {
    return (
        <Link href={`/decor/${item.slug}`}>
            <Card className="group overflow-hidden transition hover:shadow-lg">
                <div className="relative aspect-square">
                    <Image
                        src={item.image}
                        alt={`${item.name} (${item.code})`}
                        fill
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        className="object-cover"
                    />
                    <div className="absolute left-2 top-2 flex gap-2">
                        <Badge variant="secondary" className="capitalize">{item.stoneType}</Badge>
                        <Badge variant="secondary" className="capitalize">{item.surface}</Badge>
                    </div>
                </div>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between gap-3">
                        <h3 className="font-semibold leading-tight text-balance">{item.name}</h3>
                        <span className="text-sm text-muted-foreground">{item.code}</span>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{item.brand}</span>
                        <strong className="text-base">{item.price.toLocaleString()} ₽/м²</strong>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
