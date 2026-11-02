import Link from "next/link";
import type { Property } from "@/domain/entities";
import { Logo } from "./ui";

/** App frame: dark sidebar with property switcher and nav. `propertyId` undefined = all properties. */
export function Shell({ properties, propertyId, active, children }: {
  properties: Property[]; propertyId?: string; active: string; children: React.ReactNode;
}) {
  const nav = propertyId
    ? [["Beranda", `/p/${propertyId}`], ["Kamar", `/p/${propertyId}/kamar`], ["Tagihan", `/p/${propertyId}/tagihan`], ["Keuangan", `/p/${propertyId}/keuangan`], ["Tim", "/tim"]]
    : [["Ringkasan", "/ringkasan"], ["Tim", "/tim"]];
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex flex-col gap-6 bg-ink p-5 text-[#c9d7d1] md:w-64 md:shrink-0">
        <span className="text-white"><Logo /></span>
        <details className="group">
          <summary className="cursor-pointer list-none rounded-lg bg-[#1f3a30] px-3 py-2 text-white">
            <span className="block text-xs text-[#c9d7d1]">Properti</span>
            {properties.find((p) => p.id === propertyId)?.name ?? "Semua properti"}
          </summary>
          <ul className="mt-2 flex flex-col">
            <li><Link className="block rounded px-3 py-2 hover:bg-[#1f3a30]" href="/ringkasan">Semua properti</Link></li>
            {properties.map((p) => <li key={p.id}><Link className="block rounded px-3 py-2 hover:bg-[#1f3a30]" href={`/p/${p.id}`}>{p.name}</Link></li>)}
            <li><Link className="block rounded px-3 py-2 hover:bg-[#1f3a30]" href="/onboarding">+ Tambah properti</Link></li>
          </ul>
        </details>
        <nav className="flex flex-wrap gap-1 md:flex-col">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} aria-current={label === active ? "page" : undefined}
              className={`rounded-md px-3 py-2.5 hover:bg-[#1f3a30] hover:text-white ${label === active ? "bg-[#1f3a30] font-semibold text-white" : ""}`}>
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:p-8">{children}</main>
    </div>
  );
}
