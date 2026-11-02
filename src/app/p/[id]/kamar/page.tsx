import Link from "next/link";
import { notFound } from "next/navigation";
import { app } from "@/infrastructure/container";
import { Shell } from "@/presentation/Shell";
import { PageHeader, Pill, STATUS } from "@/presentation/ui";
import { rp, shortDate } from "@/presentation/format";

export default async function Kamar({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ room?: string }> }) {
  const [{ id }, { room }] = await Promise.all([params, searchParams]);
  const [property, properties, rooms] = await Promise.all([app.getProperty(id), app.listProperties(), app.listRooms(id)]);
  if (!property) notFound();
  const sel = rooms.find((r) => r.no === room) ?? rooms[0];
  const floors = [...new Set(rooms.map((r) => r.floor))];
  return (
    <Shell properties={properties} propertyId={id} active="Kamar">
      <PageHeader title="Kamar" sub={property.name} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <section className="card flex flex-col gap-4">
          {floors.map((f) => (
            <div key={f} className="flex flex-col gap-2">
              <h2 className="text-sm font-semibold text-muted">Lantai {f}</h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {rooms.filter((r) => r.floor === f).map((r) => (
                  <Link key={r.no} href={`?room=${r.no}`} aria-current={r.no === sel?.no ? "true" : undefined}
                    className={`flex min-w-0 flex-col rounded-lg border-2 p-2.5 ${STATUS[r.status].tile} ${r.no === sel?.no ? "ring-2 ring-ink ring-offset-2" : ""}`}>
                    <b>{r.no}</b><span className="truncate text-sm">{r.tenant?.split(" ")[0] ?? "–"}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
        {sel && (
          <aside className="card flex h-fit flex-col gap-3">
            <div className="flex items-center justify-between"><h2 className="text-2xl font-bold">Kamar {sel.no}</h2><Pill status={sel.status} /></div>
            <p>{sel.tenant ?? "Belum ada penyewa"}</p>
            {sel.bill && <p className="text-muted">Tagihan {rp(sel.bill.lines.reduce((s, l) => s + l.amount, 0))} · tempo {shortDate(sel.bill.due)}</p>}
            {(sel.status === "telat" || sel.status === "belum") && <Link href={`/p/${id}/tagihan?bill=${sel.bill!.id}`} className="btn-primary">Catat bayar</Link>}
          </aside>
        )}
      </div>
    </Shell>
  );
}
