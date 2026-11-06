# Apato — Page Wireframes & Feature Brief

Low-fidelity wireframes for every page of the Apato landlord dashboard.
Legend: `[Button]` primary CTA · `(Button)` secondary/ghost · `▢` input ·
`☐` checkbox · `▼` dropdown · `●` status dot · `⋯` row menu.
Status per page: ✅ exists in `src/app` · 🆕 proposed.

## Sitemap

```
Publik      /masuk  /daftar  /lupa-sandi🆕
Setup       /onboarding
Portofolio  /ringkasan  /tim  /laporan🆕  /pengaturan🆕  /notifikasi🆕
Properti    /p/[id]            Beranda
            /p/[id]/kamar      Kamar (denah + detail)
            /p/[id]/penyewa🆕  Penyewa (kontrak)
            /p/[id]/tagihan    Tagihan
            /p/[id]/keuangan   Keuangan
            /p/[id]/perbaikan🆕 Perbaikan
            /p/[id]/pengaturan🆕 Pengaturan properti
```

## Global shell (all logged-in pages)

```
┌──────────────┬───────────────────────────────────────────────────────┐
│ APATO        │ ▼ Kos Melati (switch properti)   🔍 Cari   🔔3  (RA)▼ │
│──────────────│───────────────────────────────────────────────────────│
│ ◉ Ringkasan  │  PAGE HEADER: Title / subtitle          [Primary CTA] │
│ PROPERTI     │                                                       │
│  Beranda     │                    page content                       │
│  Kamar       │                                                       │
│  Penyewa     │                                                       │
│  Tagihan     │                                                       │
│  Keuangan    │                                                       │
│  Perbaikan   │                                                       │
│ ──────────── │                                                       │
│  Tim         │                                                       │
│  Laporan     │                                                       │
│  Pengaturan  │                                                       │
└──────────────┴───────────────────────────────────────────────────────┘
Mobile: sidebar → bottom tab bar (Beranda · Kamar · Tagihan · Keuangan · Lainnya)
```
- Property switcher, global search (penyewa / kamar / tagihan), notification bell, profile menu (Profil, Pengaturan, Keluar).
- Menu items hidden by role (keeper: no Keuangan/Tim).

---

## 1. Masuk ✅ `/masuk`

```
┌────────────────────────┬─────────────────────────────┐
│  HERO (brand panel)    │  Masuk                      │
│  "Kelola kos tanpa     │  Selamat datang kembali.    │
│   ribet."              │  Email   ▢                  │
│  ilustrasi / 3 poin    │  Sandi   ▢        👁        │
│  manfaat               │  ☐ Ingat saya  Lupa sandi?  │
│                        │  [        Masuk         ]   │
│                        │  ──── atau ────             │
│                        │  (G  Masuk dengan Google)   │
│                        │  Belum punya akun? Daftar   │
└────────────────────────┴─────────────────────────────┘
```
Features: email/password login, Google SSO, remember me, error states (salah sandi, akun belum verifikasi), link to daftar & lupa sandi.

## 2. Daftar ✅ `/daftar`

```
  Buat akun — Gratis untuk properti pertama.
  Nama lengkap ▢   No. WhatsApp ▢
  Email ▢          Sandi ▢ (meter kekuatan)
  ☐ Saya setuju Syarat & Kebijakan Privasi
  [ Buat akun ]   (G Daftar dengan Google)
  Sudah punya akun? Masuk
```
Features: validation inline, WhatsApp number (used for reminders), → redirect to `/onboarding`.

## 3. Lupa sandi 🆕 `/lupa-sandi`

```
  Atur ulang sandi
  Email ▢   [ Kirim tautan ]
  ✓ state: "Cek email kamu" (Kirim ulang 0:59)
```

## 4. Onboarding ✅ `/onboarding` (wizard, 3 langkah)

```
 APATO                                         Lewati →
 ● Properti ─── ○ Kamar & harga ─── ○ Penyewa
 ┌──────────────────────────────────────────────┐
 │ Properti pertama kamu                         │
 │ Nama properti ▢     Kota ▢                    │
 │ Jumlah lantai ▢     Kamar per lantai ▢        │
 │ Harga sewa default / bln ▢ Rp                 │
 │ Tanggal jatuh tempo ▼ (tgl 1–28)              │
 │ PREVIEW denah: ▢▢▢▢ / ▢▢▢▢ (auto-generate)    │
 │                     (Kembali)  [ Lanjut → ]   │
 └──────────────────────────────────────────────┘
```
- Step 2: tabel kamar hasil generate — edit nomor, harga per kamar, fasilitas (AC, KM dalam).
- Step 3 (opsional): impor penyewa — tambah manual / upload CSV; → `[Selesai, buka dashboard]`.

## 5. Ringkasan (portofolio) ✅ `/ringkasan`

```
 Ringkasan — November 2026, 3 properti      ▼ Bulan   [+ Tambah properti]
 ┌─────────┐┌─────────┐┌─────────┐┌─────────┐
 │Pendapat.││Terkumpul││Tunggakan││Okupansi │   KPI tiles (+Δ vs bln lalu)
 │ Rp 42jt ││  78% ▓▓░││ Rp 6jt  ││  91%    │
 └─────────┘└─────────┘└─────────┘└─────────┘
 PROPERTI (cards grid)
 ┌───────────────┐┌───────────────┐┌───────────────┐
 │Kos Melati     ││Kos Mawar      ││ +             │
 │Bandung · 24 km││Depok · 16 km  ││ Tambah        │
 │Okupansi 92% ▓ ││Okupansi 81%   ││ properti      │
 │Terkumpul 80%  ││Telat: 2 ●     ││               │
 └───────────────┘└───────────────┘└───────────────┘
 PERLU TINDAKAN (list)                         Lihat semua →
 ● Budi · A-203 · Kos Melati · telat 5 hr · Rp1,5jt  (Ingatkan WA) (Catat bayar)
 ● ...
 ARUS KAS 6 BULAN  [bar chart masuk vs keluar]
```

## 6. Beranda properti ✅ `/p/[id]`

```
 Beranda — Kos Melati · Nov 2026                  [ Catat bayar ]
 KPI: Terkumpul Rp12jt/15jt ▓▓▓░ | Kamar terisi 22/24 | Telat 2 | Perbaikan 1
 ┌───────────── DENAH MINI ─────────────┐ ┌──── JATUH TEMPO 7 HARI ────┐
 │ Lt 2  ●●●●○●●●●●●●                   │ │ A-101 Sari  3 Nov  Rp1,2jt │
 │ Lt 1  ●●●●●●●✕●●●●                   │ │ ...      (Kirim pengingat) │
 │ ● lunas ● belum ● telat ○ kosong ✕ perbaikan │ └─────────────────────┘
 └──────────────────────────────────────┘
 AKTIVITAS TERBARU: "Sari bayar Rp1,2jt via QRIS · 2j lalu" ...
 QUICK ACTIONS: (+ Penyewa baru) (+ Pengeluaran) (Laporkan kerusakan)
```

## 7. Kamar ✅ `/p/[id]/kamar`

```
 Kamar — Kos Melati        ▼ Lantai  ▼ Status  🔍 No. kamar   [+ Tambah kamar]
 ┌──────────── GRID DENAH ────────────┐ ┌──── DETAIL KAMAR A-203 ────┐
 │ LT 2 [201●][202●][203●][204○]...   │ │ ● Telat 5 hari             │
 │ LT 1 [101●][102✕][103●]...         │ │ Penyewa: Budi  (WA) (Profil)│
 │ toggle: Grid | Tabel               │ │ Harga Rp1,5jt · AC · KM dlm │
 └────────────────────────────────────┘ │ Kontrak s/d Mar 2027        │
                                        │ Tagihan bln ini Rp1,5jt     │
                                        │ [ Catat bayar ]             │
                                        │ (Edit kamar) (Tandai perbaikan)│
                                        │ Riwayat: pembayaran 6 bln   │
                                        └─────────────────────────────┘
```
Empty-room panel: `[ Isi kamar → tambah penyewa ]`, (Bagikan link iklan).

## 8. Penyewa 🆕 `/p/[id]/penyewa`

```
 Penyewa — 22 aktif         Tabs: Aktif | Akan keluar | Riwayat   [+ Penyewa baru]
 🔍 Nama / kamar / HP
 ┌──────┬───────┬──────────┬────────────┬─────────┬────┐
 │Nama  │Kamar  │Mulai     │Kontrak s/d │Status   │ ⋯  │
 │Budi  │A-203  │Mar 2026  │Mar 2027    │● telat  │ ⋯  │
 └──────┴───────┴──────────┴────────────┴─────────┴────┘
 Drawer "Penyewa baru": Nama ▢ HP/WA ▢ No. KTP ▢ (Upload KTP) Kamar ▼
   Mulai ▢ Durasi ▼ Deposit ▢ Biaya tambahan (listrik/air) [+]  [ Simpan ]
 Detail: profil, dokumen, riwayat bayar, (Perpanjang) (Pindah kamar) (Check-out → kembalikan deposit)
```

## 9. Tagihan ✅ `/p/[id]/tagihan`

```
 Tagihan — Nov 2026 · Rp12jt / Rp15jt ▓▓▓░       ▼ Periode  [ Buat tagihan ]
 Tabs: Semua | Belum bayar | Telat | Lunas        (Kirim pengingat massal)
 ┌──────┬──────┬─────────┬──────────┬────────┬──────────────┐
 │Kamar │Nama  │Jatuh tmp│Total     │Sisa    │              │
 │A-203 │Budi  │1 Nov    │Rp1,55jt  │Rp1,55jt│ Catat bayar  │
 │A-101 │Sari  │1 Nov    │Rp1,2jt   │ —      │ Lihat        │
 └──────┴──────┴─────────┴──────────┴────────┴──────────────┘
 Drawer "Catat bayar":
   Rincian: Sewa 1.500.000 · Listrik 50.000 · Denda (+)
   Jumlah ▢ (bayar sebagian OK)  Metode ◉Transfer ○Tunai ○QRIS
   Tanggal ▢  Bukti (Upload)     [ Simpan pembayaran ]  (Kirim kuitansi WA)
```
Features: auto-generate monthly bills, partial payment, late fee, receipt PDF/WA.

## 10. Keuangan ✅ `/p/[id]/keuangan`

```
 Keuangan — Kos Melati · Nov 2026       ▼ Bulan  (Ekspor)  [+ Catat transaksi]
 KPI: Masuk Rp12jt | Keluar Rp3jt | Bersih Rp9jt | Margin 75%
 [chart: arus kas harian/bulanan]   [donut: pengeluaran per kategori]
 Filter: ◉Semua ○Masuk ○Keluar   ▼ Kategori  ▼ Metode
 ┌──────────┬────────────────────┬──────────┬────────┬──────────┐
 │Tanggal   │Judul               │Kategori  │Metode  │Jumlah    │
 │3 Nov     │Sewa A-101 Sari     │Sewa      │QRIS    │+1.200.000│
 │2 Nov     │Token listrik       │Utilitas  │Tunai   │  −300.000│
 └──────────┴────────────────────┴──────────┴────────┴──────────┘
 Modal "Catat transaksi": Masuk/Keluar toggle, Judul, Kategori ▼, Jumlah, Metode, Tanggal, Bukti.
```

## 11. Perbaikan 🆕 `/p/[id]/perbaikan`

```
 Perbaikan                                  [+ Laporkan kerusakan]
 Kanban: Dilaporkan | Dikerjakan | Selesai
 ┌ Card: A-102 · AC bocor · 2 hr lalu · Foto · PIC: Pak Udin · Biaya Rp250rb ┐
 Selesai → otomatis jadi pengeluaran di Keuangan & kamar kembali tersedia.
```

## 12. Tim ✅ `/tim`

```
 Tim — Siapa saja yang ikut mengelola           [+ Undang anggota]
 ┌────────┬───────────────┬──────────┬──────────────────┬────┐
 │Nama    │Email          │Peran     │Properti          │ ⋯  │
 │Rifky   │rifky@…        │Pemilik   │Semua             │    │
 │Dewi    │dewi@…         │Manajer ▼ │Melati, Mawar     │ ⋯  │
 │(undangan tertunda)     │Penjaga   │Melati  (Kirim ulang)  │
 └────────┴───────────────┴──────────┴──────────────────┴────┘
 Modal Undang: Email ▢  Peran ◉Manajer ○Penjaga  Properti ☐☐☐  [ Kirim undangan ]
 Matriks hak akses per peran (read-only table).
```

## 13. Laporan 🆕 `/laporan`

```
 Laporan        ▼ Properti (Semua)  ▼ Periode  [ Unduh PDF ] (Excel)
 Cards: Laba-rugi · Okupansi per bulan · Tunggakan (aging 0-30/31-60/60+) · Pendapatan per kamar
```

## 14. Notifikasi 🆕 `/notifikasi` (juga dropdown 🔔)

```
 Tabs: Semua | Pembayaran | Tunggakan | Kontrak | Tim      (Tandai semua dibaca)
 ● Sari membayar Rp1,2jt · 2j       → buka tagihan
 ● Kontrak Budi berakhir 30 hari    → (Perpanjang)
```

## 15. Pengaturan 🆕 `/pengaturan` & `/p/[id]/pengaturan`

```
 Tabs: Profil | Properti | Tagihan & denda | Pembayaran | Pengingat | Langganan
 - Profil: nama, foto, HP, ganti sandi.
 - Properti: nama, alamat, foto, fasilitas, aturan kos, (Arsipkan properti).
 - Tagihan: tgl jatuh tempo, denda/hari, biaya tambahan default.
 - Pembayaran: rekening bank, QRIS (upload), instruksi bayar.
 - Pengingat: WA H-3 / H0 / H+3, template pesan editable, preview.
 - Langganan: paket, kuota properti, [ Upgrade ].
```

---

## Shared states (every page)
- **Empty**: illustration + one sentence + primary CTA (e.g. "Belum ada tagihan" → [Buat tagihan]).
- **Loading**: skeleton rows/cards. **Error**: banner + (Coba lagi).
- **Toast** after save: "Pembayaran tersimpan · (Urungkan)".
- **Role guard**: page without access → "Kamu tidak punya akses" + back.

## Priority
1. MVP (done): Masuk, Daftar, Onboarding, Ringkasan, Beranda, Kamar, Tagihan, Keuangan, Tim.
2. Next: Penyewa, Pengaturan (tagihan & pembayaran), Notifikasi, WA reminders.
3. Later: Perbaikan, Laporan, Langganan, Lupa sandi.
