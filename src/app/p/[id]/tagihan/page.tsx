import Link from "next/link";
import { notFound } from "next/navigation";
import { app } from "@/infrastructure/container";
import { Shell } from "@/presentation/Shell";
import { PageHeader, Pill } from "@/presentation/ui";
import { PaymentForm } from "@/presentation/forms";
import { jt, rp, shortDate } from "@/presentation/format";

const TABS = [["belum", "Belum"], ["telat", "Telat"], ["lunas", "Lunas"], ["semua", "Semua"]] as const;

export default async function Tagihan({ params, searchParams }: {
  params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string; bill?: string }>;
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const [property, properties, bills] = await Promise.all([app.getProperty(id), app.listProperties(), app.listBills(id)]);
  if (!property) notFound();
  const tab = TABS.find(([k]) => k === sp.tab)?.[0] ?? "belum";
  const match = (b: (typeof bills)[number], k: string) => k === "semua" || (k === "belum" ? b.status !== "lunas" : b.status === k);
  const rows = bills.filter((b) => match(b, tab));
  const sel = bills.find((b) => b.id === sp.bill) ?? rows.find((b) => b.remaining > 0);
  const total = bills.reduce((s, b) => s + b.total, 0), paid = bills.reduce((s, b) => s + b.paid, 0);
  return (
    <Shell properties={properties} propertyId={id} active="Tagihan">
      <PageHeader title="Tagihan" sub={`Nov 2026 · ${jt(paid)} / ${jt(total)}`} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <section className="card relative flex flex-col gap-3 overflow-x-auto">
          <nav className="flex gap-1 border-b border-line">
            {TABS.map(([k, l]) => (
              <Link key={k} href={`?tab=${k}`} aria-current={k === tab ? "page" : undefined}
                className={`border-b-2 px-3 py-2.5 ${k === tab ? "border-brand font-semibold" : "border-transparent text-muted"}`}>
                {l} <span className="rounded-full bg-neutral-soft px-2 text-sm">{bills.filter((b) => match(b, k)).length}</span>
              </Link>
            ))}
          </nav>
          <table className="w-full min-w-[600px] text-left">
            <thead className="text-sm text-muted"><tr><th className="py-2">Penyewa</th><th>Total</th><th>Sisa</th><th>Tempo</th><th>Status</th><th><span className="sr-only">Aksi</span></th></tr></thead>
            <tbody className="divide-y divide-line">
              {rows.map((b) => (
                <tr key={b.id} className={b.id === sel?.id ? "bg-[#f2faf6]" : ""}>
                  <td className="py-2.5"><b>{b.tenant}</b> <span className="text-muted">· {b.room}</span></td>
                  <td>{rp(b.total)}</td><td>{b.remaining ? rp(b.remaining) : "–"}</td><td>{shortDate(b.due)}</td>
                  <td><Pill status={b.status}>{b.status === "telat" ? `${b.late} hari` : undefined}</Pill></td>
                  <td className="text-right"><Link href={`?tab=${tab}&bill=${b.id}`} className="font-semibold text-brand">{b.remaining ? "Catat bayar" : "Lihat"}</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        {sel && (
          <aside className="card flex h-fit flex-col gap-4">
            <div><h2 className="text-xl font-bold">{sel.tenant}</h2><p className="text-muted">Kamar {sel.room} · tempo {shortDate(sel.due)}</p></div>
            <dl className="flex flex-col gap-1">
              {sel.lines.map((l) => <div key={l.label} className="flex justify-between"><dt>{l.label}</dt><dd>{rp(l.amount)}</dd></div>)}
              {sel.paid > 0 && <div className="flex justify-between text-muted"><dt>Sudah dibayar</dt><dd>−{rp(sel.paid)}</dd></div>}
              <div className="flex justify-between border-t border-line pt-2 font-bold"><dt>Sisa</dt><dd>{rp(sel.remaining)}</dd></div>
            </dl>
            {sel.remaining > 0 ? <PaymentForm billId={sel.id} remaining={sel.remaining} /> : <Pill status="lunas" />}
          </aside>
        )}
      </div>
    </Shell>
  );
}
