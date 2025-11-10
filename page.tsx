import Catalog from "./components/Catalog";
import Cart from "./components/Cart";
import DeliveryForm from "./components/DeliveryForm";

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6">
      <section className="lg:col-span-2 space-y-6">
        <Catalog />
        <DeliveryForm />
      </section>
      <section className="space-y-6">
        <Cart />
      </section>
    </main>
  );
}
