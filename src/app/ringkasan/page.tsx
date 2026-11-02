export const dynamic = "force-dynamic"; // in-memory data changes at runtime
import Link from "next/link";
import { app } from "@/infrastructure/container";
import { Shell } from "@/presentation/Shell";
import { PageHeader, Pill, Stat } from "@/presentation/ui";
import { jt, rp } from "@/presentation/format";

export default async function Ringkasan() {
  const { properties, followUps } = await app.getOverview();
  const sum = (k: "billed" | "paid" | "out") => properties.reduce((s, p) => s + p[k], 0);
  return (
    <Shell properties={properties} active="Ringkasan">
      <PageHeader title="Ringkasan" sub={`November 2026, ${properties.length} properti`}>
        <Link href="/onboarding" className="btn-primary">Tambah properti</Link>
      </PageHeader>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Masuk" value={jt(sum("paid"))} sub={`dari ${jt(sum("billed"))} ditagih`} />
        <Stat label="Belum dibayar" value={jt(sum("billed") - sum("paid"))} sub={`${followUps.length} tagihan, ${followUps.filter((f) => f.late).length} sudah telat`} />
        <Stat label="Bersih" value={jt(sum("paid") - sum("out"))} sub={`setelah pengeluaran ${jt(sum("out"))}`} />
      </div>
      <section className="grid gap-4 md:grid-cols-3">
        {properties.map((p) => (
          <Link key={p.id} href={`/p/${p.id}`} className="card flex flex-col gap-2 hover:border-brand">
            <span className="text-lg font-bold">{p.name}</span>
            <span className="text-muted">{p.city}</span>
            <span>{p.occupied}/{p.rooms} terisi · {jt(p.paid)} masuk</span>
          </Link>
        ))}
      </section>
      <section className="card flex flex-col gap-3">
        <h2 className="text-lg font-bold">Perlu ditagih</h2>
        <ul className="divide-y divide-line">
          {followUps.map((f) => (
            <li key={f.id} className="flex flex-wrap items-center gap-3 py-3">
              <span className="flex-1"><b>{f.tenant}</b><br /><span className="text-sm text-muted">{properties.find((p) => p.id === f.propertyId)?.name}, kamar {f.room}</span></span>
              <Pill status={f.status}>{f.late ? `Telat ${f.late} hari` : `Tempo ${f.due.slice(8)}/${f.due.slice(5, 7)}`}</Pill>
              <span className="w-32 text-right font-semibold">{rp(f.remaining)}</span>
              <Link href={`/p/${f.propertyId}/tagihan?bill=${f.id}`} className="btn-ghost">Catat bayar</Link>
            </li>
          ))}
        </ul>
      </section>
    </Shell>
  );
}
