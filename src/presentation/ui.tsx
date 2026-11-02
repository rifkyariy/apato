import type { RoomStatus } from "@/domain/entities";

export const STATUS: Record<RoomStatus, { label: string; tile: string; pill: string }> = {
  lunas: { label: "Lunas", tile: "bg-brand text-white border-brand", pill: "bg-brand-soft text-brand-dark" },
  belum: { label: "Belum bayar", tile: "bg-mint text-[#0a3d31] border-mint", pill: "bg-neutral-soft text-[#3e4e47]" },
  telat: { label: "Telat", tile: "bg-late text-ink border-late", pill: "bg-late-soft text-late-ink" },
  kosong: { label: "Kosong", tile: "bg-white text-[#3e4e47] border-[#9aa9a2] border-dashed", pill: "bg-neutral-soft text-[#3e4e47]" },
  perbaikan: { label: "Perbaikan", tile: "bg-[#e6ece9] text-[#3e4e47] border-[#9aa9a2] border-dashed", pill: "bg-[#e6ece9] text-[#3e4e47]" },
};

export function Pill({ status, children }: { status: RoomStatus; children?: React.ReactNode }) {
  return <span className={`rounded-full px-2.5 py-1 text-sm font-semibold ${STATUS[status].pill}`}>{children ?? STATUS[status].label}</span>;
}

export function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card flex flex-col gap-1">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-2xl font-bold">{value}</span>
      {sub && <span className="text-sm text-muted">{sub}</span>}
    </div>
  );
}

export function PageHeader({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {sub && <p className="text-muted">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5 text-lg font-bold">
      <span className="flex size-8 items-center justify-center rounded-lg bg-[#19a07f] text-ink">
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" /><path d="M2 20h20" /><path d="M14 12v.01" />
        </svg>
      </span>
      Apato
    </span>
  );
}
