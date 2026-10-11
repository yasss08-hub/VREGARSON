'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { useCart } from '@/context/CartContext';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface ColorVariant {
  colorName: string;
  imageUrl: string;
}

interface Product {
  id: string;
  name: string;
  title?: string;
  price: number;
  image_url: string;
  category: string;
  color_variants?: ColorVariant[];
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { totalItems } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-[#0d0d0d] text-[#888] min-h-screen flex items-center justify-center text-xs tracking-[0.3em] uppercase">
        LOADING VRE GARSON...
      </div>
    );
  }

  return (
    <div className="bg-[#0d0d0d] text-[#f5f5f5] min-h-screen flex flex-col justify-between selection:bg-white selection:text-black">
      {/* High-End Minimalist Header */}
      <header className="border-b border-[#262626] px-8 py-6 flex justify-between items-center sticky top-0 bg-[#0d0d0d]/90 backdrop-blur-md z-40">
        <Link href="/" className="text-sm font-black tracking-[0.25em] uppercase hover:opacity-75 transition">
          VRE GARSON
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/admin" className="text-[11px] text-[#777] hover:text-white transition tracking-widest uppercase">
            ADMIN
          </Link>
          <Link href="/cart" className="text-[11px] font-bold tracking-[0.2em] uppercase border border-[#333] px-4 py-2 hover:border-white transition">
            BAG [{totalItems}]
          </Link>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="border-b border-[#262626] px-8 py-16 md:py-24 max-w-7xl mx-auto w-full text-center space-y-4">
        <p className="text-[10px] text-[#777] tracking-[0.4em] uppercase">MAURITIUS • EXCLUSIVE DROPS</p>
        <h1 className="text-3xl md:text-5xl font-black tracking-widest uppercase">PREMIUM STREETWEAR</h1>
        <p className="text-xs text-[#888] max-w-md mx-auto tracking-wider leading-relaxed">
          Engineered aesthetics. Limited quantities available via WhatsApp instant checkout.
        </p>
      </section>

      {/* Catalog Grid */}
      <main className="max-w-7xl mx-auto px-8 py-16 flex-grow w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((p) => {
            const displayImage = p.color_variants?.[0]?.imageUrl || p.image_url;
            return (
              <div key={p.id} className="bg-[#121212] border border-[#222] flex flex-col justify-between group overflow-hidden transition hover:border-[#444]">
                <div>
                  <div className="aspect-[3/4] bg-[#0a0a0a] overflow-hidden relative">
                    {displayImage ? (
                      <img
                        src={displayImage}
                        alt={p.name || p.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-[#444] tracking-widest uppercase">
                        NO IMAGE
                      </div>
                    )}
                    {p.color_variants && p.color_variants.length > 0 && (
                      <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-[9px] font-bold tracking-widest text-[#ccc] px-2 py-1 uppercase border border-white/10">
                        {p.color_variants.length} Colors
                      </span>
                    )}
                  </div>
                  <div className="p-6 space-y-2">
                    <p className="text-[10px] text-[#777] tracking-widest uppercase">{p.category || 'DROP'}</p>
                    <h3 className="text-xs font-bold tracking-wider uppercase text-white">{p.name || p.title}</h3>
                    <p className="text-xs font-semibold text-[#aaa]">Rs {p.price?.toLocaleString()}</p>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <Link
                    href={`/shop/${p.id}`}
                    className="block text-center w-full bg-[#1a1a1a] border border-[#333] py-3.5 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black hover:border-white transition duration-300"
                  >
                    VIEW PIECE
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#262626] px-8 py-8 text-center text-[10px] text-[#666] tracking-[0.2em] uppercase">
        © {new Date().getFullYear()} VRE GARSON • ALL RIGHTS RESERVED
      </footer>
    </div>
  );
}