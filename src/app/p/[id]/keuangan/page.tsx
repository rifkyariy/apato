import { notFound } from "next/navigation";
import { app } from "@/infrastructure/container";
import { Shell } from "@/presentation/Shell";
import { PageHeader, Stat } from "@/presentation/ui";
import { rp, shortDate } from "@/presentation/format";

export default async function Keuangan({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [property, properties, f] = await Promise.all([app.getProperty(id), app.listProperties(), app.getFinance(id)]);
  if (!property) notFound();
  const max = f.categories[0]?.[1] ?? 1;
  return (
    <Shell properties={properties} propertyId={id} active="Keuangan">
      <PageHeader title="Keuangan" sub={`${property.name} · Nov 2026`} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Masuk" value={rp(f.in)} /><Stat label="Keluar" value={rp(f.out)} /><Stat label="Bersih" value={rp(f.in - f.out)} />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="card flex flex-col gap-3">
          <h2 className="text-lg font-bold">Pengeluaran</h2>
          {f.categories.length === 0 && <p className="text-muted">Belum ada pengeluaran.</p>}
          {f.categories.map(([name, v]) => (
            <div key={name} className="flex flex-col gap-1">
              <div className="flex justify-between"><span>{name}</span><span>{rp(v)}</span></div>
              <div className="h-2 rounded-full bg-neutral-soft"><div className="h-2 rounded-full bg-late" style={{ width: `${(v / max) * 100}%` }} /></div>
            </div>
          ))}
        </section>
        <section className="card flex flex-col gap-3">
          <h2 className="text-lg font-bold">Transaksi</h2>
          <ul className="divide-y divide-line">
            {f.transactions.map((t) => (
              <li key={t.id} className="flex justify-between gap-3 py-2.5">
                <span><b>{t.title}</b><br /><span className="text-sm text-muted">{[t.method, shortDate(t.date)].filter(Boolean).join(" · ")}</span></span>
                <span className={`font-semibold ${t.kind === "in" ? "text-brand" : "text-late-ink"}`}>{t.kind === "in" ? "+" : "−"}{rp(t.amount)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Shell>
  );
}
