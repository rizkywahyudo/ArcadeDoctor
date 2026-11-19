# Arcade Doctors

Platform berbahasa Indonesia untuk membantu teknisi mesin arcade dan elektronika.

## Fitur versi awal

- Dashboard responsif.
- Pencari manual dengan integrasi pencarian web opsional (Tavily).
- Konsultasi Dokter AI melalui OpenAI API.
- Kalkulator kode warna resistor 4 gelang.
- Kalkulator Hukum Ohm.
- Ensiklopedia ringkas komponen elektronika.
- Pustaka topik teknik dan riwayat konsultasi pada sesi browser.

> Catatan: pencarian manual menampilkan hasil dan tautan ke sumber. Aplikasi tidak otomatis mengunduh atau menyalin file dari situs pihak ketiga. Unduh dokumen hanya jika sumber mengizinkannya. Database komponen saat ini merupakan konten awal yang dapat dikembangkan.

## Persyaratan

- Node.js 18.17 atau lebih baru
- npm
- Akun GitHub
- Akun Vercel (untuk deployment)
- OpenAI API key (untuk AI sungguhan)
- Tavily API key (opsional, untuk pencarian web)

## Menjalankan di komputer

1. Ekstrak ZIP proyek.
2. Buka folder `arcade-doctors` melalui terminal.
3. Pasang dependensi:

   ```bash
   npm install
   ```

4. Salin `.env.example` menjadi `.env.local`.
5. Isi API key yang tersedia:

   ```env
   OPENAI_API_KEY=isi_api_key_openai
   OPENAI_MODEL=gpt-4o-mini
   TAVILY_API_KEY=isi_api_key_tavily
   ```

6. Jalankan:

   ```bash
   npm run dev
   ```

7. Buka `http://localhost:3000`.

Tanpa API key, antarmuka dan kalkulator tetap bisa digunakan. Fitur AI dan pencarian web akan memberi pemberitahuan bahwa konfigurasi belum tersedia.

## Upload ke GitHub

### Cara melalui website GitHub
1. Buat repository baru bernama `arcade-doctors`.
2. Ekstrak ZIP ini di komputer.
3. Upload seluruh isi folder proyek ke repository (bukan file ZIP-nya).
4. Pastikan `.env.local` tidak ikut diunggah.

### Cara melalui Git

```bash
git init
git add .
git commit -m "Initial Arcade Doctors project"
git branch -M main
git remote add origin https://github.com/USERNAME/arcade-doctors.git
git push -u origin main
```

Ganti `USERNAME` dengan nama akun GitHub kamu.

## Deploy ke Vercel

1. Masuk ke https://vercel.com.
2. Pilih **Add New → Project**.
3. Impor repository `arcade-doctors` dari GitHub.
4. Framework akan terdeteksi sebagai Next.js.
5. Buka **Environment Variables**.
6. Tambahkan:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` = `gpt-4o-mini`
   - `TAVILY_API_KEY` (opsional)
7. Klik **Deploy**.

Setelah deploy, setiap push ke branch utama akan memicu deployment baru.

## Struktur proyek

```text
arcade-doctors/
├── app/
│   ├── api/
│   │   ├── chat/route.ts
│   │   └── manuals/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── .env.example
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## Keamanan dan batasan

- Jangan pernah menaruh API key di kode frontend atau repository.
- Gunakan Environment Variables Vercel untuk rahasia.
- Untuk penggunaan publik, tambahkan autentikasi, rate limiting, batas biaya API, validasi input, dan pemantauan penyalahgunaan.
- Jangan mengunggah manual/datasheet berhak cipta tanpa izin.
- Hasil AI harus diverifikasi dengan manual servis dan pengukuran nyata.
- Kalkulator dan ensiklopedia awal bukan pengganti datasheet komponen.

## Pengembangan berikutnya

- Supabase Auth dan PostgreSQL untuk akun serta penyimpanan riwayat permanen.
- Supabase Storage untuk dokumen yang pengguna berhak simpan.
- RAG untuk tanya-jawab berdasarkan manual yang diizinkan.
- OCR dan analisis foto PCB.
- Pencarian datasheet multi-sumber dengan atribusi.
- Database mesin arcade, kode error, dan katalog komponen.
