import type { Bill, Member, Property, Repository, Room, Transaction } from "@/domain/entities";

// shortcut: in-memory store, resets on server restart; swap for a DB-backed Repository when persistence is needed.

const NAMES = ["Andi Saputra", "Hana Pertiwi", "Joko Susilo", "Lia Amelia", "Rizky Hidayat", "Nadia Putri", "Galih Permana",
  "Maya Anggraini", "Tegar Ramadhan", "Putri Ayuningtyas", "Eka Wulandari", "Yusuf Maulana", "Citra Dewi", "Arif Budiman",
  "Intan Permata", "Rendi Kurniawan", "Dewi Safitri", "Bima Aditya", "Tari Oktaviani", "Hendro Wijaya", "Laras Kusuma"];

type Seed = Omit<Property, "id"> & {
  id: string;
  fixed: Record<string, string>;
  empty: string[];
  repair: string[];
  owing: Record<string, [due: string, amount: number, paid?: number, utilities?: boolean]>;
};

const SEEDS: Seed[] = [
  { id: "melati", name: "Kos Melati", city: "Yogyakarta", floors: 4, perFloor: 8, price: 1_400_000,
    fixed: { "201": "Wulan Sari", "204": "Rina Kartika", "302": "Dimas Prasetyo", "406": "Ayu Lestari", "107": "Bagus Wicaksono", "203": "Sinta Maharani", "401": "Fajar Nugroho" },
    empty: ["105", "207", "403"], repair: ["308"],
    owing: { "204": ["2026-10-23", 1_450_000, 0, true], "302": ["2026-10-26", 1_350_000], "406": ["2026-10-29", 1_600_000, 800_000],
      "107": ["2026-11-03", 1_400_000], "203": ["2026-11-05", 1_300_000], "401": ["2026-11-06", 1_400_000] } },
  { id: "kenanga", name: "Kos Kenanga", city: "Yogyakarta", floors: 2, perFloor: 6, price: 1_200_000,
    fixed: { "103": "Doni Saputra", "205": "Mega Lestari" }, empty: ["106"], repair: [],
    owing: { "103": ["2026-10-28", 1_100_000], "205": ["2026-11-04", 1_200_000] } },
  { id: "anggrek", name: "Kos Anggrek", city: "Sleman", floors: 2, perFloor: 8, price: 900_000,
    fixed: { "108": "Fitri Handayani", "112": "Hadi Susanto", "115": "Nanda Pratiwi" }, empty: ["104", "206"], repair: [],
    owing: { "108": ["2026-10-30", 900_000], "112": ["2026-11-03", 900_000], "115": ["2026-11-08", 900_000] } },
];

const id = () => crypto.randomUUID();

function addRooms(rooms: Room[], p: Property, s?: Seed) {
  let n = 0;
  for (let f = 1; f <= p.floors; f++)
    for (let i = 1; i <= p.perFloor; i++) {
      const no = String(f * 100 + i);
      const occupied = s && !s.empty.includes(no) && !s.repair.includes(no);
      rooms.push({ no, propertyId: p.id, floor: f, repair: s?.repair.includes(no),
        tenant: occupied ? s.fixed[no] ?? NAMES[n++ % NAMES.length] : undefined });
    }
}

function createStore() {
  const properties: Property[] = [];
  const rooms: Room[] = [];
  const bills: Bill[] = [];
  const transactions: Transaction[] = [];
  for (const s of SEEDS) {
    const { fixed, empty, repair, owing, ...p } = s;
    properties.push(p);
    addRooms(rooms, p, s);
    for (const r of rooms.filter((r) => r.propertyId === p.id && r.tenant)) {
      const [due, amount, paid, utilities] = owing[r.no] ?? ["2026-11-01", p.price, p.price];
      bills.push({ id: `${p.id}-${r.no}`, propertyId: p.id, tenant: r.tenant!, room: r.no, due, paid: paid ?? 0,
        lines: utilities ? [{ label: "Sewa", amount: amount - 150_000 }, { label: "Listrik", amount: 110_000 }, { label: "Air", amount: 40_000 }]
          : [{ label: "Sewa", amount }] });
    }
}

transactions.push(
  ...([
    ["in", "Wulan · 201", "Sewa", "transfer", "2026-11-01", 1_450_000],
    ["in", "Andi · 101", "Sewa", "qris", "2026-11-01", 1_400_000],
    ["out", "Gaji penjaga", "Gaji penjaga", "tunai", "2026-11-01", 2_000_000],
    ["in", "Ayu · 406", "Sewa", "transfer", "2026-10-31", 800_000],
    ["out", "Token listrik umum", "Listrik", undefined, "2026-10-31", 400_000],
    ["out", "Servis pompa air", "Perbaikan", undefined, "2026-10-30", 350_000],
    ["in", "Hana · 102", "Sewa", "transfer", "2026-10-30", 1_400_000],
    ["out", "Alat kebersihan", "Kebersihan", undefined, "2026-10-29", 185_000],
  ] as const).map(([kind, title, category, method, date, amount]) => ({ id: id(), propertyId: "melati", kind, title, category, method, date, amount })),
);

const members: Member[] = [
  { id: id(), name: "Kamu", email: "Pemilik akun", role: "owner", propertyIds: [] },
  { id: id(), name: "Sari Wulandari", email: "sari.w@email.com", role: "manager", propertyIds: ["melati", "kenanga"] },
  { id: id(), name: "Pak Darto", email: "darto@email.com", role: "keeper", propertyIds: ["melati"] },
  { id: id(), name: "Bu Ningsih", email: "ningsih@email.com", role: "keeper", propertyIds: ["anggrek"], pending: true },
];

return { properties, rooms, bills, transactions, members };
}

// Shared via globalThis: Next can load this module more than once (per route bundle, HMR), which would split the store.
const g = globalThis as unknown as { apatoStore?: ReturnType<typeof createStore> };
const { properties, rooms, bills, transactions, members } = (g.apatoStore ??= createStore());

export const memoryRepository: Repository = {
  properties: async () => properties,
  property: async (pid) => properties.find((p) => p.id === pid),
  addProperty: async (data) => {
    const p = { ...data, id: id().slice(0, 8) };
    properties.push(p);
    addRooms(rooms, p);
    return p;
  },
  rooms: async (pid) => rooms.filter((r) => r.propertyId === pid),
  bills: async (pid) => bills.filter((b) => !pid || b.propertyId === pid),
  bill: async (bid) => bills.find((b) => b.id === bid),
  saveBill: async (b) => { bills[bills.findIndex((x) => x.id === b.id)] = b; },
  transactions: async (pid) => transactions.filter((t) => !pid || t.propertyId === pid).sort((a, b) => b.date.localeCompare(a.date)),
  addTransaction: async (t) => { transactions.push({ ...t, id: id() }); },
  members: async () => members,
  addMember: async (m) => { members.push({ ...m, id: id() }); },
};
