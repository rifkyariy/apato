import Link from "next/link";
import { AuthLayout } from "@/presentation/AuthLayout";

// shortcut: no real auth yet; the form just enters the app. Add an auth provider before going live.
export default function Masuk() {
  return (
    <AuthLayout>
      <div><h1 className="text-3xl font-bold tracking-tight">Masuk</h1><p className="text-muted">Selamat datang kembali.</p></div>
      <form action="/ringkasan" className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">Email<input className="input font-normal" type="email" name="email" autoComplete="email" required /></label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">Kata sandi<input className="input font-normal" type="password" name="pw" autoComplete="current-password" required /></label>
        <button className="btn-primary h-12">Masuk</button>
      </form>
      <p className="text-center text-muted">Belum punya akun? <Link className="font-semibold text-brand" href="/daftar">Daftar</Link></p>
    </AuthLayout>
  );
}
