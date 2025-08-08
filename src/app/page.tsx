import { Header } from "@/components/header";
import { TippingCard } from "@/components/tipping-card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <TippingCard />
      </main>
    </div>
  );
}
