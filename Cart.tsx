"use client";
import { useEffect, useMemo, useState } from "react";

export default function Cart() {
  const [items, setItems] = useState<any[]>([]);
  const [delivery, setDelivery] = useState<any>({});
  const [supplierId, setSupplierId] = useState<string>("");
  const [partnerId, setPartnerId] = useState<string>("");
  const subtotal = useMemo(()=>items.reduce((s,i)=>s + i.unitPrice * i.qty, 0), [items]);

  useEffect(()=>{
    const add = (e: any) => {
      const { productId, name, unitPrice } = e.detail;
      setItems((cur)=>{
        const i = cur.find((x)=>x.productId===productId);
        if (i) return cur.map((x)=> x.productId===productId ? { ...x, qty: x.qty + 1 } : x);
        return [...cur, { productId, name, unitPrice, qty: 1 }];
      });
    };
    const deliv = (e:any)=> setDelivery(e.detail);
    document.addEventListener("cart:add", add as any);
    document.addEventListener("delivery:update", deliv as any);
    return ()=>{
      document.removeEventListener("cart:add", add as any);
      document.removeEventListener("delivery:update", deliv as any);
    };
  }, []);

  const updateQty = (id:string, q:number)=> setItems((cur)=>cur.map(x=>x.productId===id?{...x, qty:Math.max(1,q)}:x));
  const remove = (id:string)=> setItems((cur)=>cur.filter(x=>x.productId!==id));

  async function submitOrder() {
    if (!partnerId || !supplierId) return alert("Impostare Partner ID e Supplier ID");
    if (!delivery?.ragione || !delivery?.indirizzo || !delivery?.referente) return alert("Compilare la Scheda Dati Consegna");
    const payload = {
      partnerId,
      supplierId,
      delivery,
      items: items.map(i=>({ productId: i.productId, qty: i.qty }))
    };
    const r = await fetch("/api/orders", { method: "POST", body: JSON.stringify(payload) });
    if (!r.ok) return alert("Errore creazione ordine");
    const data = await r.json();
    alert(`Ordine creato: ${data.order.code}`);
    setItems([]);
  }

  return (
    <div className="bg-white rounded-2xl border p-4 space-y-3">
      <div className="font-semibold">Carrello</div>
      <div className="grid gap-2 text-sm">
        <input className="border rounded-lg px-3 py-2" placeholder="Partner ID (demo)" value={partnerId} onChange={e=>setPartnerId(e.target.value)} />
        <input className="border rounded-lg px-3 py-2" placeholder="Supplier ID (demo)" value={supplierId} onChange={e=>setSupplierId(e.target.value)} />
      </div>
      {items.length===0 ? (
        <p className="text-sm text-slate-500">Nessun prodotto nel carrello.</p>
      ):(
        <div className="space-y-2">
          {items.map((it)=> (
            <div key={it.productId} className="flex items-center justify-between gap-2 border rounded-xl p-2">
              <div>
                <div className="text-sm font-medium">{it.name}</div>
                <div className="text-xs text-slate-500">{(it.unitPrice/100).toLocaleString("it-IT", { style:"currency", currency:"EUR" })}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-2 py-1 rounded border" onClick={()=>updateQty(it.productId, it.qty-1)}>−</button>
                <span className="w-6 text-center text-sm">{it.qty}</span>
                <button className="px-2 py-1 rounded border" onClick={()=>updateQty(it.productId, it.qty+1)}>+</button>
                <button className="text-xs text-slate-500 hover:text-red-600" onClick={()=>remove(it.productId)}>Rimuovi</button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between border-t pt-2">
            <div className="text-sm text-slate-500">Subtotale</div>
            <div className="font-semibold">{(subtotal/100).toLocaleString("it-IT", { style:"currency", currency:"EUR" })}</div>
          </div>
          <button className="w-full rounded-xl py-2.5 text-sm bg-emerald-600 text-white" onClick={submitOrder}>Conferma e genera ordine</button>
        </div>
      )}
    </div>
  );
}
