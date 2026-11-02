import { Logo } from "./ui";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-wrap bg-white">
      <section aria-label="Tentang Apato" className="flex min-h-[420px] flex-[1_1_520px] flex-col justify-between gap-10 bg-ink p-10 text-white">
        <Logo />
        <div className="flex max-w-md flex-col gap-4">
          <h2 className="text-4xl font-bold leading-tight tracking-tight">Kamar siap, penyewa senang.</h2>
          <p className="text-lg text-[#e7efeb]">Kelola kamar, tagihan dan uang masuk dari semua kos kamu di satu tempat.</p>
        </div>
      </section>
      <main className="flex flex-[1_1_480px] items-center justify-center px-6 py-12">
        <div className="flex w-full max-w-sm flex-col gap-6">{children}</div>
      </main>
    </div>
  );
}
