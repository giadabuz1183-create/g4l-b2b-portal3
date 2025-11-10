import { prisma } from "@/lib/db";

export default async function Dashboard() {
  const orders = await prisma.order.findMany({ include: { items: true, partner: true, supplier: true, tracking: true }, orderBy: { createdAt: "desc" } });
  return (
    <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-xl font-semibold">Dashboard mensile</h1>
      <div className="bg-white border rounded-2xl p-4 overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="py-2">Data</th>
              <th>Codice</th>
              <th>Partner</th>
              <th>Fornitore</th>
              <th>Articoli</th>
              <th>Tracking</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o)=> (
              <tr key={o.id} className="border-t">
                <td className="py-2">{new Date(o.createdAt).toLocaleString("it-IT")}</td>
                <td>{o.code}</td>
                <td>{o.partner.name}</td>
                <td>{o.supplier.name}</td>
                <td>{o.items.reduce((s,i)=>s+i.qty,0)}</td>
                <td>{o.tracking.map(t=>t.number).join(", ") || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
