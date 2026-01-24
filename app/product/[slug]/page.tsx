import Header from "@/components/Header";
import ProductDetailClient from "@/components/ProductDetailClient";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

// SEO Metadata generation
export async function generateMetadata({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const product = await prisma.product.findUnique({
        where: { slug }
    });

    if (!product) return {};

    return {
        title: `${product.name} | Luiff Art`,
        description: product.description?.slice(0, 160) || 'Modern Art Store',
    }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;

    // Fetch Data
    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            variants: true,
            category: true
        }
    });

    if (!product) {
        notFound();
    }

    // Convert Decimals to numbers for Client Component serialization
    const serializedProduct = {
        ...product,
        variants: product.variants.map(v => ({
            ...v,
            priceTRY: Number(v.priceTRY),
            priceUSD: Number(v.priceUSD),
            weight: v.weight || 0,
            desi: v.desi || 0,
            width: v.width || 0,
            height: v.height || 0,
            depth: v.depth || 0,
        }))
    };

    return (
        <main>
            <Header />
            <ProductDetailClient product={serializedProduct} />
        </main>
    );
}
