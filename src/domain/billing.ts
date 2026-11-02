import type { Bill, Room, RoomStatus } from "./entities.ts";

const DAY = 86_400_000;

export const billTotal = (b: Bill) => b.lines.reduce((s, l) => s + l.amount, 0);
export const billRemaining = (b: Bill) => Math.max(0, billTotal(b) - b.paid);
export const daysLate = (b: Bill, today: string) =>
  Math.max(0, Math.floor((Date.parse(today) - Date.parse(b.due)) / DAY));

export type BillStatus = "lunas" | "telat" | "belum";
export function billStatus(b: Bill, today: string): BillStatus {
  if (billRemaining(b) === 0) return "lunas";
  return daysLate(b, today) > 0 ? "telat" : "belum";
}

/** Applies a payment; rejects non-positive amounts and overpayment. */
export function applyPayment(b: Bill, amount: number): Bill {
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("Jumlah harus lebih dari 0");
  if (amount > billRemaining(b)) throw new Error("Jumlah melebihi sisa tagihan");
  return { ...b, paid: b.paid + amount };
}

export function roomStatus(room: Room, bill: Bill | undefined, today: string): RoomStatus {
  if (room.repair) return "perbaikan";
  if (!room.tenant) return "kosong";
  return bill ? billStatus(bill, today) : "lunas";
}
