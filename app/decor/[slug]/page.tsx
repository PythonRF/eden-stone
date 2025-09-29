// app/decor/[slug]/page.tsx
import DecorDetailsClient from "@/components/decor/DecorDetailsClient";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function DecorDetailsPage({
                                                   params,
                                               }: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params; // как ты требуешь

    return <DecorDetailsClient slug={slug} />;
}
