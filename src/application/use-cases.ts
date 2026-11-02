import type { PaymentMethod, Property, Repository, Role } from "@/domain/entities";
import { applyPayment, billRemaining, billStatus, billTotal, daysLate, roomStatus } from "@/domain/billing";

// Use cases take the repository as a dependency so infrastructure can be swapped.
export function makeUseCases(repo: Repository, today: () => string) {
  async function propertySummary(p: Property) {
    const [rooms, bills, tx] = await Promise.all([repo.rooms(p.id), repo.bills(p.id), repo.transactions(p.id)]);
    const billed = bills.reduce((s, b) => s + billTotal(b), 0);
    const paid = bills.reduce((s, b) => s + b.paid, 0);
    const out = tx.filter((t) => t.kind === "out").reduce((s, t) => s + t.amount, 0);
    return { ...p, rooms: rooms.length, occupied: rooms.filter((r) => r.tenant).length, billed, paid, out };
  }

  async function followUps(propertyId?: string) {
    const t = today();
    return (await repo.bills(propertyId))
      .filter((b) => billRemaining(b) > 0)
      .map((b) => ({ ...b, remaining: billRemaining(b), late: daysLate(b, t), status: billStatus(b, t) }))
      .sort((a, b) => b.late - a.late || a.due.localeCompare(b.due));
  }

  return {
    listProperties: () => repo.properties(),
    getProperty: (id: string) => repo.property(id),

    async getOverview() {
      const props = await Promise.all((await repo.properties()).map(propertySummary));
      return { properties: props, followUps: await followUps() };
    },

    async getDashboard(propertyId: string) {
      const p = await repo.property(propertyId);
      if (!p) return undefined;
      const [summary, rooms, chase, tx] = await Promise.all([propertySummary(p), this.listRooms(propertyId), followUps(propertyId), repo.transactions(propertyId)]);
      return { summary, rooms, followUps: chase, activity: tx.slice(0, 5) };
    },

    async listRooms(propertyId: string) {
      const [rooms, bills] = await Promise.all([repo.rooms(propertyId), repo.bills(propertyId)]);
      const t = today();
      return rooms.map((r) => {
        const bill = bills.find((b) => b.room === r.no);
        return { ...r, status: roomStatus(r, bill, t), bill };
      });
    },

    async listBills(propertyId: string) {
      const t = today();
      return (await repo.bills(propertyId)).map((b) => ({
        ...b, total: billTotal(b), remaining: billRemaining(b), late: daysLate(b, t), status: billStatus(b, t),
      }));
    },

    async recordPayment(billId: string, amount: number, method: PaymentMethod) {
      const bill = await repo.bill(billId);
      if (!bill) throw new Error("Tagihan tidak ditemukan");
      if (!["transfer", "tunai", "qris"].includes(method)) throw new Error("Metode tidak valid");
      await repo.saveBill(applyPayment(bill, amount));
      await repo.addTransaction({ propertyId: bill.propertyId, kind: "in", title: `${bill.tenant.split(" ")[0]} · ${bill.room}`,
        category: "Sewa", method, date: today(), amount });
    },

    async getFinance(propertyId: string) {
      const tx = await repo.transactions(propertyId);
      const sum = (k: "in" | "out") => tx.filter((t) => t.kind === k).reduce((s, t) => s + t.amount, 0);
      const categories = new Map<string, number>();
      for (const t of tx.filter((t) => t.kind === "out")) categories.set(t.category, (categories.get(t.category) ?? 0) + t.amount);
      return { in: sum("in"), out: sum("out"), transactions: tx, categories: [...categories].sort((a, b) => b[1] - a[1]) };
    },

    listMembers: () => repo.members(),
    async inviteMember(email: string, role: Exclude<Role, "owner">, propertyIds: string[]) {
      if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Email tidak valid");
      if (role !== "manager" && role !== "keeper") throw new Error("Peran tidak valid");
      await repo.addMember({ name: email.split("@")[0], email, role, propertyIds, pending: true });
    },

    async addProperty(input: { name: string; city: string; floors: number; perFloor: number; price: number }) {
      if (!input.name.trim()) throw new Error("Nama properti wajib diisi");
      if (!(input.floors >= 1 && input.floors <= 20 && input.perFloor >= 1 && input.perFloor <= 50)) throw new Error("Jumlah kamar tidak valid");
      return repo.addProperty(input);
    },
  };
}
