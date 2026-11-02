import Link from "next/link";
import { AuthLayout } from "@/presentation/AuthLayout";

// shortcut: no real sign-up yet; continues to onboarding.
export default function Daftar() {
  return (
    <AuthLayout>
      <div><h1 className="text-3xl font-bold tracking-tight">Buat akun</h1><p className="text-muted">Gratis untuk properti pertama.</p></div>
      <form action="/onboarding" className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">Nama<input className="input font-normal" name="nama" autoComplete="name" required /></label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">Email<input className="input font-normal" type="email" name="email" autoComplete="email" required /></label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">Kata sandi<input className="input font-normal" type="password" name="pw" autoComplete="new-password" minLength={8} required />
          <span className="font-normal text-muted">Minimal 8 karakter.</span></label>
        <button className="btn-primary h-12">Buat akun</button>
      </form>
      <p className="text-center text-muted">Sudah punya akun? <Link className="font-semibold text-brand" href="/masuk">Masuk</Link></p>
    </AuthLayout>
  );
}
