const MON = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export const rp = (v: number) => "Rp" + v.toLocaleString("id-ID");
export const jt = (v: number) => "Rp" + (v / 1e6).toFixed(1).replace(".", ",") + " jt";
export const shortDate = (iso: string) => { const d = new Date(iso); return `${d.getUTCDate()} ${MON[d.getUTCMonth()]}`; };
