import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import prisma from "@/lib/prisma";

// Revalidate data every hour
// export const revalidate = 3600;
export const dynamic = 'force-dynamic';

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      variants: true,
      category: true
    },
    take: 8,
    orderBy: { createdAt: 'desc' }
  });

  // Transform and serialize for Client Components
  return products.map(p => {
    // Find lowest price variants
    const minPriceTRY = p.variants.reduce((min, v) =>
      Number(v.priceTRY) < min ? Number(v.priceTRY) : min, Infinity);
    const minPriceUSD = p.variants.reduce((min, v) =>
      Number(v.priceUSD) < min ? Number(v.priceUSD) : min, Infinity);

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      imageUrl: p.images[0] || 'https://placehold.co/600x800',
      categoryName: p.category?.name,
      priceTRY: minPriceTRY === Infinity ? 0 : minPriceTRY,
      priceUSD: minPriceUSD === Infinity ? 0 : minPriceUSD,
      variantsCount: p.variants.length
    };
  });
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <main className="bg-[#fdfbf7] min-h-screen">
      <Header />
      <HeroSection />

      <section className="py-24 px-4 md:px-8 max-w-[1600px] mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-outfit tracking-[0.2em] text-gray-500 uppercase">Curated Selection</span>
          <h2 className="text-4xl md:text-5xl font-italiana mt-3 text-gray-900">Featured Collection</h2>
        </div>

        {/* Masonry-ish Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {featuredProducts.map((product, index) => (
            <div key={product.id} className={`${index % 2 === 1 ? 'lg:translate-y-12' : ''}`}>
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        <div className="text-center mt-24">
          <a href="/collections" className="inline-block border-b border-black pb-1 font-outfit text-sm tracking-widest hover:text-gray-600 hover:border-gray-600 transition-colors">
            VIEW ALL ARTWORKS
          </a>
        </div>
      </section>

      {/* Spacer for scroll effect */}
      <div className="h-32"></div>
    </main>
  );
}
