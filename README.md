# ToolHive — Neighborhood Tool Library

ToolHive is a neighborhood tool-sharing web platform that connects tool owners with neighbors who need to borrow them. It functions as a **community-driven, hyper-local tool lending library**, inspired by modern marketplace platforms like Airbnb.

![System Architecture Diagram](architecture_daigram.png)

## 🚀 Quick Start

Ensure you have [Bun](https://bun.sh/) installed.

```bash
# Install dependencies
bun install

# Run development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js (App Router) |
| **Language** | TypeScript |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS v4 |
| **Icons** | React Icons (Ionicons 5) |
| **Package Manager** | Bun |
| **Deployment** | Railway |

---

## 🏗️ System Architecture

ToolHive follows a **Simplified Layered Architecture** designed for zero-friction API migration. The layers are strictly separated:

1. **App Layer**: Next.js App Router for routing and page structure.
2. **UI Layer**: Reusable React components (`src/components`).
3. **Service Layer**: Business logic and data fetching orchestration (`src/services`).
4. **API Layer**: Next.js Route Handlers (`app/api`) serving as a RESTful gateway.
5. **Data Layer**: JSON-based persistent storage (`src/data`) for Phase 1.

---

## ✨ Features

- **Browse & Search**: Discover tools by category, location, and price with a persistent filter sidebar.
- **Detailed Listings**: View tool specifications, availability, and owner ratings.
- **Booking Flow**: Select date ranges with an automatic cost calculator.
- **Simulated Payment**: End-to-end payment simulation with multiple methods (Card, UPI, Net Banking, Wallet).
- **Owner Dashboard**: Manage your own tool listings (Add, Edit, Delete, Toggle Availability).
- **Request Management**: Approve or reject incoming borrow requests.
- **Borrower Tracker**: Keep track of your active and past tool borrows.

---

## 💳 Payment Simulation

The payment flow is simulated for demonstration purposes. Use the deterministic test values below to test specific outcomes:

### Test Credentials

| Method | Passes with... | Fails with... |
|---|---|---|
| **Card** | `4242 4242 4242 4242` | `4000 0000 0000 0002` |
| **UPI** | `success@test` | `fail@test` |
| **Net Banking** | State Bank of India | Punjab National Bank |
| **Wallet** | Paytm | Amazon Pay |

---

## 📂 Project Structure

```
tool-hive/
├── app/                  # Next.js App Router (Pages & API)
│   ├── api/              # RESTful API Endpoints
│   ├── browse/           # Tool Discovery
│   ├── tool/[id]/        # Tool Details & Booking
│   └── (dashboard)/      # Requests, Borrowed, My Tools
├── src/
│   ├── components/       # 17+ Reusable UI Components
│   ├── services/         # Data Abstraction Layer
│   ├── data/             # Mock JSON Databases
│   ├── lib/              # Utility & DB Helpers
│   └── types/            # Shared TypeScript Interfaces
└── public/               # Static Assets
```

---

## 📝 Notes

- **Data Persistence**: All changes are written to local JSON files in `src/data`.
- **Phase 2 Migration**: The architecture is built to swap the JSON data layer for a real Database (PostgreSQL/MongoDB) and real Payment Gateway (Razorpay/Stripe) by modifying only the `apiClient.ts` and `paymentService.ts`.

---

*Project developed for the Advanced Web & Software Technologies Lab (AWSTL).*
