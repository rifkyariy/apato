import Link from "next/link";
import { Logo } from "@/presentation/ui";
import { PropertyForm } from "@/presentation/forms";

export default function Onboarding() {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-line bg-white px-8 py-3.5"><Logo /><Link href="/ringkasan" className="text-brand">Lewati</Link></header>
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-10">
        <div><h1 className="text-3xl font-bold tracking-tight">Properti pertama kamu</h1>
          <p className="text-muted">Cukup garis besarnya. Detail tiap kamar bisa diubah nanti.</p></div>
        <PropertyForm />
      </main>
    </div>
  );
}
