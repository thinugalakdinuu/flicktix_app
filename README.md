# 🎟️ FlickTix – The Future of Movie Ticket Booking

FlickTix is a modern, intuitive, and seamless movie ticket reservation platform. From selecting movies and showtimes to booking seats and making secure payments — FlickTix redefines the cinema experience for users and theater owners alike.

> Built with ❤️ using **Next.js**, **Tailwind CSS**, **ShadCN UI**, **Stripe**, and **Sanity.io**.

---

## 🚀 Live Demo
🌐 [https://flicktix.vercel.app](https://flicktix.vercel.app)

---

## 🧠 Features

- 🔍 Browse and filter movies by date
- 🪑 View available showtimes and reserved seats
- 📱 OTP verification-based booking system
- 💳 Stripe-powered secure checkout
- 📩 Session-based booking summary
- 🎬 Dynamic content via Sanity CMS

---

## 🛠 Tech Stack

| Layer        | Tech Stack                            |
|--------------|----------------------------------------|
| **Frontend** | Next.js, React, Tailwind CSS, ShadCN UI |
| **Backend**  | Sanity CMS, Stripe, Vercel Serverless Functions |
| **Database** | Sanity.io (Headless CMS)               |
| **Payment**  | Stripe Integration                     |

---

## 📁 Project Structure

```bash
flicktix/
│
├── app/                # Next.js App Router Pages
├── components/         # Reusable UI Components
├── lib/                # Utility Functions (Stripe, Sanity)
├── sanity/             # Sanity Studio + Schemas
├── public/             # Static Assets
├── tailwind.config.js  # Tailwind Configuration
├── .env.example        # Environment Variable Template
└── README.md           # This File
