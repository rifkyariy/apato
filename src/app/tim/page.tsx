export const dynamic = "force-dynamic"; // in-memory data changes at runtime
import { app } from "@/infrastructure/container";
import { Shell } from "@/presentation/Shell";
import { PageHeader } from "@/presentation/ui";
import { InviteForm } from "@/presentation/forms";

const ROLE = { owner: "Pemilik", manager: "Pengelola", keeper: "Penjaga" };

export default async function Tim() {
  const [members, properties] = await Promise.all([app.listMembers(), app.listProperties()]);
  const nameOf = (id: string) => properties.find((p) => p.id === id)?.name;
  return (
    <Shell properties={properties} active="Tim">
      <PageHeader title="Tim" sub="Siapa saja yang ikut mengelola, dan properti mana." />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <section className="card relative overflow-x-auto">
          <table className="w-full min-w-[520px] text-left">
            <thead className="text-sm text-muted"><tr><th className="py-2">Nama</th><th>Peran</th><th>Properti</th></tr></thead>
            <tbody className="divide-y divide-line">
              {members.map((m) => (
                <tr key={m.id}>
                  <td className="py-2.5"><b>{m.name}</b><br /><span className="text-sm text-muted">{m.pending ? "Undangan terkirim" : m.email}</span></td>
                  <td>{ROLE[m.role]}</td>
                  <td>{m.role === "owner" ? "Semua properti" : m.propertyIds.map(nameOf).join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <InviteForm properties={properties} />
      </div>
    </Shell>
  );
}
