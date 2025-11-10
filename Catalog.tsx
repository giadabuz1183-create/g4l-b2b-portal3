"use client";
import { useEffect, useState } from "react";
import { euro, platformPrice } from "@/lib/price";

export default function Catalog() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products").then(r=>r.json()).then(d=>setProducts(d.products)).finally(()=>setLoading(false));
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {loading && <div className="text-sm text-slate-500">Caricamento prodotti…</div>}
      {products.map((p) => (
        <div key={p.id} className="rounded-2xl border shadow-sm p-4 space-y-2">
          <div className="font-semibold">{p.name}</div>
          <div className="text-sm">
            Prezzo piattaforma: <span className="font-medium">{euro(platformPrice(p.publicPrice))}</span>
            <span className="ml-2 line-through text-slate-500">{euro(p.publicPrice)}</span>
          </div>
          <button className="w-full rounded-xl py-2 text-sm bg-emerald-600 text-white" onClick={()=>document.dispatchEvent(new CustomEvent("cart:add", { detail: { productId: p.id, name: p.name, unitPrice: platformPrice(p.publicPrice) } }))}>
            Aggiungi al carrello
          </button>
        </div>
      ))}
    </div>
  );
}
