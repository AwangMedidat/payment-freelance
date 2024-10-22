# Payment Freelance

Project ini adalah aplikasi berbasis Next.js yang dirancang untuk memudahkan pengelolaan pembayaran freelance.

## Prerequisites

Sebelum menjalankan project ini, pastikan Anda telah menginstal:

- **Node.js** (versi 14 atau lebih baru)
- **npm** (versi 6 atau lebih baru) atau **yarn**
- **Database** (seperti PostgreSQL, MySQL, dll.) untuk mengelola data.

## Instalasi

Ikuti langkah-langkah berikut untuk menginstal dan menjalankan project:

1. **Clone repositori ini:**

   ```bash
   git clone https://github.com/AwangMedidat/payment-freelance.git
   cd payment-freelance

2. **Instal dependensi:**

   ```bash
   npm install

3. **Siapkan database:**

- Buat database baru sesuai dengan jenis database yang Anda gunakan.

- Buat file .env di root folder project Anda dan atur variabel lingkungan sesuai kebutuhan. Contoh:

   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/nama_database"

4. **Inisialisasi Prisma:**

   ```bash
   npx prisma migrate dev

5. **Jalankan aplikasi:**

   ```bash
   npm run dev

