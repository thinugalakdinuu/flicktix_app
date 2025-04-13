# 🎟️ FlickTix – The Future of Movie Ticket Booking

FlickTix is a modern, intuitive, and seamless movie ticket reservation platform. From selecting movies and showtimes to booking seats and making secure payments — FlickTix redefines the cinema experience for users and theater owners alike.

> Built with ❤️ using **Next.js**, **Tailwind CSS**, **ShadCN UI**, **Stripe**, and **Sanity.io**.

---

## 🚀 Live Demo
🌐 [https://flicktix-app.vercel.app](https://flicktix-app.vercel.app)

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
| **Database** | Sanity.io                              |
| **Payment**  | Stripe Integration                     |

---

## 📁 Project Structure

```bash
flicktix/
│
├── pages/              # Next.js Page Router Pages
|    ├── api/           # API
├── components/         # Reusable UI Components
├── lib/                # Utility Functions (Stripe, Sanity)
├── sanity_flicktix/    # Sanity Studio + Schemas
├── public/             # Static Assets
├── .env                # Environment Variable Template
