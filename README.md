# ToolHive

ToolHive is a neighbourhood tool-sharing platform where users can browse, borrow, and lend tools to people nearby. Built with Next.js 16, React 19, and Tailwind CSS.

## Getting Started

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Features

- Browse and search tools by category and location
- View detailed tool pages with owner info and ratings
- Simulated payment gateway when borrowing a tool
- Booking confirmation with transaction ID after a successful payment

## Payment Gateway

The payment flow is simulated — no real money is involved. It has a 90% success rate by default, but you can use the test values below to force a specific outcome every time.

### Card

| Outcome | Card Number | Expiry | CVV |
|---|---|---|---|
| Always passes | `4242 4242 4242 4242` | `12/27` | `123` |
| Always fails | `4000 0000 0000 0002` | `12/27` | `123` |

Validation errors (instant, no delay): card number not 16 digits, expiry not in MM/YY format, CVV less than 3 digits.

### UPI

| Outcome | UPI ID |
|---|---|
| Always passes | `success@test` |
| Always fails | `fail@test` |

Validation error: UPI ID must follow the `name@bank` format.

### Net Banking

| Outcome | Bank to select |
|---|---|
| Always passes | State Bank of India |
| Always fails | Punjab National Bank |

Any other bank goes through the random 90/5/5 outcome.

### Wallet

| Outcome | Wallet to select |
|---|---|
| Always passes | Paytm |
| Always fails | Amazon Pay |

## Notes

- All data is read from local JSON files. There is no real backend.
- To integrate a real payment gateway, replace `simulatePayment()` in `src/services/paymentService.ts` with a Razorpay or Stripe call.
- Active development branch: `feature/payment-gateway-simulation`
