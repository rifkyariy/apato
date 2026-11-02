"use client";
import { useActionState } from "react";
import { addProperty, inviteMember, recordPayment } from "@/app/actions";
import type { Property } from "@/domain/entities";
import { rp } from "./format";

const Err = ({ msg }: { msg: string | null }) => msg ? <p role="alert" className="text-sm font-semibold text-late-ink">{msg}</p> : null;

export function PaymentForm({ billId, remaining }: { billId: string; remaining: number }) {
  const [error, action, pending] = useActionState(recordPayment, null);
  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="billId" value={billId} />
      <label className="flex flex-col gap-1.5 text-sm font-semibold">Jumlah (sisa {rp(remaining)})
        <input key={billId} className="input font-normal" name="amount" inputMode="numeric" defaultValue={remaining.toLocaleString("id-ID")} required />
      </label>
      <fieldset className="flex flex-wrap gap-2">
        <legend className="mb-1.5 text-sm font-semibold">Metode</legend>
        {[["transfer", "Transfer"], ["tunai", "Tunai"], ["qris", "QRIS"]].map(([v, l], i) => (
          <label key={v} className="flex h-11 items-center gap-2 rounded-lg border border-field px-3">
            <input type="radio" name="method" value={v} defaultChecked={i === 0} />{l}
          </label>
        ))}
      </fieldset>
      <Err msg={error} />
      <button className="btn-primary" disabled={pending}>{pending ? "Menyimpan…" : "Simpan"}</button>
    </form>
  );
}

export function PropertyForm() {
  const [error, action, pending] = useActionState(addProperty, null);
  const field = "flex flex-col gap-1.5 text-sm font-semibold";
  return (
    <form action={action} className="card grid gap-4 sm:grid-cols-2">
      <label className={field}>Nama properti<input className="input font-normal" name="name" required /></label>
      <label className={field}>Kota<input className="input font-normal" name="city" required /></label>
      <label className={field}>Jumlah lantai<input className="input font-normal" name="floors" type="number" min={1} max={20} defaultValue={2} /></label>
      <label className={field}>Kamar per lantai<input className="input font-normal" name="perFloor" type="number" min={1} max={50} defaultValue={6} /></label>
      <label className={field}>Harga sewa per bulan (Rp)<input className="input font-normal" name="price" inputMode="numeric" defaultValue="1.000.000" required /></label>
      <div className="flex items-end justify-end gap-3 sm:col-span-2"><Err msg={error} /><button className="btn-primary" disabled={pending}>Selesai</button></div>
    </form>
  );
}

export function InviteForm({ properties }: { properties: Property[] }) {
  const [error, action, pending] = useActionState(inviteMember, null);
  return (
    <form action={action} className="card flex flex-col gap-4">
      <h2 className="text-lg font-bold">Undang anggota</h2>
      <label className="flex flex-col gap-1.5 text-sm font-semibold">Email<input className="input font-normal" type="email" name="email" required /></label>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 text-sm font-semibold">Peran</legend>
        <label className="flex gap-2"><input type="radio" name="role" value="manager" /><span><b>Pengelola</b> · catat bayar, kelola kamar dan penyewa, lihat keuangan.</span></label>
        <label className="flex gap-2"><input type="radio" name="role" value="keeper" defaultChecked /><span><b>Penjaga</b> · catat bayar dan check-in. Tidak bisa lihat keuangan.</span></label>
      </fieldset>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 text-sm font-semibold">Properti</legend>
        {properties.map((p) => <label key={p.id} className="flex gap-2"><input type="checkbox" name="props" value={p.id} />{p.name}</label>)}
      </fieldset>
      <Err msg={error} />
      <button className="btn-primary" disabled={pending}>Kirim undangan</button>
    </form>
  );
}
