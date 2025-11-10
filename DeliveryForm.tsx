"use client";
import { useEffect, useState } from "react";

export default function DeliveryForm() {
  const [form, setForm] = useState<any>({});
  useEffect(()=>{
    const listener = () => document.dispatchEvent(new CustomEvent("delivery:update", { detail: form }));
    listener();
  }, [form]);

  const set = (k: string, v: any) => setForm((s:any)=>({ ...s, [k]: v }));

  return (
    <div className="bg-white rounded-2xl border p-4 space-y-3">
      <div className="font-semibold">Scheda Dati Consegna (Obbligatoria)</div>
      <div className="grid md:grid-cols-2 gap-3 text-sm">
        <input className="border rounded-lg px-3 py-2" placeholder="Ragione sociale / Committente" onChange={(e)=>set("ragione", e.target.value)} />
        <input className="border rounded-lg px-3 py-2" placeholder="Persona di riferimento (telefono)" onChange={(e)=>set("referente", e.target.value)} />
        <input className="border rounded-lg px-3 py-2 md:col-span-2" placeholder="Indirizzo completo di consegna" onChange={(e)=>set("indirizzo", e.target.value)} />
        <input className="border rounded-lg px-3 py-2" placeholder="Giorni/orari disponibili" onChange={(e)=>set("fasce", e.target.value)} />
        <select className="border rounded-lg px-3 py-2" onChange={(e)=>set("accesso", e.target.value)}>
          <option>Tipologia accesso</option>
          <option>Accesso libero</option>
          <option>Strada stretta</option>
          <option>ZTL</option>
          <option>Cantiere</option>
        </select>
        <select className="border rounded-lg px-3 py-2" onChange={(e)=>set("mezzo", e.target.value)}>
          <option>Mezzo richiesto</option>
          <option>Bilico</option>
          <option>Motrice</option>
          <option>Furgone</option>
          <option>Mezzo con sponda idraulica</option>
          <option>Mezzo con muletto</option>
        </select>
        <select className="border rounded-lg px-3 py-2" onChange={(e)=>set("scaricoAssistito", e.target.value)}>
          <option>Scarico assistito?</option>
          <option>Sì</option>
          <option>No</option>
        </select>
        <textarea className="border rounded-lg px-3 py-2 md:col-span-2 min-h-[80px]" placeholder="Note logistiche (pendenze, cancello, foto accesso, ecc.)" onChange={(e)=>set("note", e.target.value)} />
      </div>
    </div>
  );
}
