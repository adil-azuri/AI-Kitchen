# AI-Kitchen 🍽️

AI-Kitchen adalah aplikasi web satu halaman (SPA) inovatif yang memanfaatkan kecerdasan buatan (AI) untuk membantu pengguna dalam eksplorasi kuliner. Aplikasi ini memungkinkan pengguna untuk mendapatkan resep masakan hanya dengan mengunggah gambar.

Fitur utamanya adalah kemampuan untuk mengunggah gambar, baik itu foto masakan yang sudah jadi maupun bahan-bahan mentah, untuk kemudian dianalisis oleh AI yang akan memberikan resep dan petunjuk cara memasak yang relevan. Aplikasi ini dirancang untuk memberikan pengalaman yang mulus dan intuitif bagi para pencinta masak.

## Struktur Proyek

```
ai-kitchen/
├── public/
├── src/
│   ├── app/
│   │   ├── api/          # API Routes untuk interaksi dengan AI
│   │   └── page.tsx      # Halaman utama
│   └── components/       # Komponen React
├── .env.local            # File environment variables
├── package.json
└── ...
```

## Fitur

- **Unggah Gambar:** Pengguna dapat mengunggah gambar bahan makanan atau masakan jadi.
- **Analisis AI:** Gambar yang diunggah dianalisis menggunakan model AI generatif (Google Gemini/OpenAI).
- **Generasi Resep:** AI akan menghasilkan resep lengkap berdasarkan konten gambar, termasuk bahan-bahan dan langkah-langkah memasak.
- **Antarmuka Intuitif:** Desain halaman tunggal yang sederhana dan mudah digunakan.

## Tech Stack

- **Framework:** Next.js 15
- **UI Library:** React 19, MUI Joy, Tailwind CSS
- **AI / SDK:** Vercel AI SDK, Google AI SDK, OpenAI
- **File Handling:** React Dropzone

## Memulai Proyek

### Prasyarat

- Node.js (v20 atau lebih baru)
- npm atau Yarn

### Instalasi

1.  Clone repositori ini:
    ```bash
    git clone https://github.com/adil-azuri/AI-Kitchen.git
    cd ai-kitchen
    ```

2.  Install semua _dependency_ yang dibutuhkan:
    ```bash
    npm install
    ```

3.  Buat file `.env.local` di root project dan tambahkan API key Anda.

    ```env
    # Pilih salah satu atau keduanya, tergantung model AI yang ingin digunakan
    GOOGLE_API_KEY="your_google_api_key"
    OPENAI_API_KEY="your_openai_api_key"
    ```

4.  Jalankan server pengembangan:
    ```bash
    npm run dev
    ```

5.  Buka http://localhost:3000 di browser Anda.

## API Endpoints

Proyek ini menggunakan Next.js App Router, di mana logika backend untuk berinteraksi dengan AI ditangani melalui _Server Actions_ atau _API Routes_.

- **Server Action/API Route**: Terdapat logika sisi server yang menerima _prompt_ teks dan gambar, kemudian mengirimkannya ke Google AI/OpenAI API untuk menghasilkan resep.

## Environment Variables

Variabel berikut perlu diatur dalam file `.env.local` Anda:

- `GOOGLE_API_KEY`: API Key untuk Google AI (Gemini).
- `OPENAI_API_KEY`: API Key untuk OpenAI.