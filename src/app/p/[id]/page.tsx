import Link from "next/link";
import { notFound } from "next/navigation";
import { app } from "@/infrastructure/container";
import { Shell } from "@/presentation/Shell";
import { PageHeader, Pill, STATUS, Stat } from "@/presentation/ui";
import { jt, rp, shortDate } from "@/presentation/format";

export default async function Beranda({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [d, properties] = await Promise.all([app.getDashboard(id), app.listProperties()]);
  if (!d) notFound();
  const { summary: s } = d;
  return (
    <Shell properties={properties} propertyId={id} active="Beranda">
      <PageHeader title="Beranda" sub={`${s.name} · Nov 2026`}><Link href={`/p/${id}/tagihan`} className="btn-primary">Catat bayar</Link></PageHeader>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Hunian" value={`${s.occupied}/${s.rooms}`} />
        <Stat label="Ditagih" value={jt(s.billed)} />
        <Stat label="Masuk" value={jt(s.paid)} />
        <Stat label="Belum bayar" value={jt(s.billed - s.paid)} />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="card flex flex-col gap-3">
          <h2 className="text-lg font-bold">Perlu ditagih</h2>
          <ul className="divide-y divide-line">
            {d.followUps.map((f) => (
              <li key={f.id} className="flex items-center gap-3 py-2.5">
                <span className="flex-1"><b>{f.tenant}</b> <span className="text-muted">· {f.room}</span></span>
                <span>{rp(f.remaining)}</span>
                <Pill status={f.status}>{f.late ? `${f.late} hr` : shortDate(f.due)}</Pill>
              </li>
            ))}
          </ul>
        </section>
        <section className="card flex flex-col gap-3">
          <h2 className="text-lg font-bold">Peta kamar</h2>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {d.rooms.map((r) => <Link key={r.no} href={`/p/${id}/kamar?room=${r.no}`} title={STATUS[r.status].label}
              className={`flex h-11 items-center justify-center rounded-md border-2 text-sm font-semibold ${STATUS[r.status].tile}`}>{r.no}</Link>)}
          </div>
          <div className="flex flex-wrap gap-2">{(Object.keys(STATUS) as (keyof typeof STATUS)[]).map((k) => <Pill key={k} status={k} />)}</div>
        </section>
      </div>
      <section className="card flex flex-col gap-3">
        <h2 className="text-lg font-bold">Aktivitas</h2>
        <ul className="divide-y divide-line">
          {d.activity.map((t) => (
            <li key={t.id} className="flex justify-between py-2.5">
              <span>{t.title} · <span className={t.kind === "in" ? "text-brand" : "text-late-ink"}>{t.kind === "in" ? "+" : "−"}{rp(t.amount)}</span></span>
              <span className="text-muted">{shortDate(t.date)}</span>
            </li>
          ))}
        </ul>
      </section>
    </Shell>
  );
}
