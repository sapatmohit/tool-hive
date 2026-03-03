/**
 * paymentService.ts — Mock Payment Gateway Simulation
 *
 * Simulates a full payment flow for borrowing a tool.
 * In P2, replace `simulatePayment` with a real call to Razorpay / Stripe.
 *
 * Intentionally introduces realistic latency and random failure rates to
 * make the simulation feel authentic.
 */

export type PaymentMethod = "card" | "upi" | "netbanking" | "wallet";

export type PaymentStatus = "idle" | "processing" | "success" | "failed" | "declined";

export interface PaymentDetails {
    method: PaymentMethod;
    // Card fields
    cardNumber?: string;
    cardHolder?: string;
    expiry?: string;
    cvv?: string;
    // UPI
    upiId?: string;
    // Netbanking
    bank?: string;
    // Wallet
    wallet?: string;
}

export interface PaymentResult {
    status: "success" | "failed" | "declined";
    transactionId: string | null;
    message: string;
    timestamp: string;
    amount: number;
    method: PaymentMethod;
}

/** Simulate a network + bank round-trip delay (1.5 – 3.5 s) */
function delay(ms: number) {
    return new Promise<void>((res) => setTimeout(res, ms));
}

/** Luhn-light check: just ensures 16 digits, not empty */
function isValidCardNumber(num: string): boolean {
    const stripped = num.replace(/\s/g, "");
    return /^\d{16}$/.test(stripped);
}

/** 90 % success rate, 5 % decline, 5 % network failure — realistic simulation */
function pickOutcome(): "success" | "failed" | "declined" {
    const r = Math.random();
    if (r < 0.90) return "success";
    if (r < 0.95) return "declined";
    return "failed";
}

/**
 * Magic test values — deterministic outcomes for demos (à la Stripe test cards).
 *
 * Card:        4242 4242 4242 4242  → always success
 *              4000 0000 0000 0002  → always declined
 * UPI:         success@test         → always success
 *              fail@test            → always declined
 * Net Banking: SBI                  → always success
 *              PNB                  → always declined
 * Wallet:      paytm                → always success
 *              amazon               → always declined
 */
const MAGIC_SUCCESS_CARD = "4242424242424242";
const MAGIC_FAIL_CARD    = "4000000000000002";
const MAGIC_SUCCESS_UPI  = "success@test";
const MAGIC_FAIL_UPI     = "fail@test";
const MAGIC_SUCCESS_BANK = "sbi";
const MAGIC_FAIL_BANK    = "pnb";
const MAGIC_SUCCESS_WALLET = "paytm";
const MAGIC_FAIL_WALLET    = "amazon";

/**
 * Simulate a card payment.
 * Validates details client-side, then "calls" the gateway.
 */
async function processCardPayment(details: PaymentDetails, amount: number): Promise<PaymentResult> {
    // Client-side validation
    if (!details.cardNumber || !isValidCardNumber(details.cardNumber)) {
        return {
            status: "failed",
            transactionId: null,
            message: "Invalid card number. Please check and try again.",
            timestamp: new Date().toISOString(),
            amount,
            method: "card",
        };
    }
    if (!details.expiry || !/^\d{2}\/\d{2}$/.test(details.expiry)) {
        return {
            status: "failed",
            transactionId: null,
            message: "Invalid expiry date. Use MM/YY format.",
            timestamp: new Date().toISOString(),
            amount,
            method: "card",
        };
    }
    if (!details.cvv || !/^\d{3,4}$/.test(details.cvv)) {
        return {
            status: "failed",
            transactionId: null,
            message: "Invalid CVV.",
            timestamp: new Date().toISOString(),
            amount,
            method: "card",
        };
    }

    // Simulate gateway round-trip
    await delay(2000 + Math.random() * 1500);

    // Magic test cards — deterministic outcome
    const stripped = details.cardNumber.replace(/\s/g, "");
    const outcome =
        stripped === MAGIC_SUCCESS_CARD ? "success" :
        stripped === MAGIC_FAIL_CARD    ? "declined" :
        pickOutcome();  // random for all other valid cards

    if (outcome === "success") {
        return {
            status: "success",
            transactionId: `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
            message: "Payment successful! Your borrow request has been confirmed.",
            timestamp: new Date().toISOString(),
            amount,
            method: "card",
        };
    }

    if (outcome === "declined") {
        return {
            status: "declined",
            transactionId: null,
            message: "Your card was declined. Please check your card details or try a different payment method.",
            timestamp: new Date().toISOString(),
            amount,
            method: "card",
        };
    }

    return {
        status: "failed",
        transactionId: null,
        message: "Payment gateway error. Please try again in a moment.",
        timestamp: new Date().toISOString(),
        amount,
        method: "card",
    };
}

/** Simulate UPI payment — OTP-style async confirm */
async function processUpiPayment(details: PaymentDetails, amount: number): Promise<PaymentResult> {
    if (!details.upiId || !/^[\w.\-]+@[\w]+$/.test(details.upiId)) {
        return {
            status: "failed",
            transactionId: null,
            message: "Invalid UPI ID. Format: yourname@bank",
            timestamp: new Date().toISOString(),
            amount,
            method: "upi",
        };
    }
    await delay(2500 + Math.random() * 1000);

    // Magic UPI IDs — deterministic outcome
    const outcome =
        details.upiId === MAGIC_SUCCESS_UPI ? "success" :
        details.upiId === MAGIC_FAIL_UPI    ? "declined" :
        pickOutcome();  // random for all other valid UPI IDs

    return {
        status: outcome,
        transactionId: outcome === "success"
            ? `UPI-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
            : null,
        message: outcome === "success"
            ? "UPI payment successful!"
            : outcome === "declined"
                ? "UPI payment rejected by your bank."
                : "UPI transaction timed out. Please retry.",
        timestamp: new Date().toISOString(),
        amount,
        method: "upi",
    };
}

/** Simulate netbanking / wallet — magic selectors for demo, random otherwise */
async function processSimplePayment(method: PaymentMethod, amount: number, details: PaymentDetails): Promise<PaymentResult> {
    await delay(3000 + Math.random() * 500);

    // Magic bank / wallet selectors — deterministic outcome
    let outcome: "success" | "failed" | "declined";
    if (method === "netbanking") {
        outcome =
            details.bank === MAGIC_SUCCESS_BANK ? "success" :
            details.bank === MAGIC_FAIL_BANK    ? "declined" :
            pickOutcome();
    } else {
        outcome =
            details.wallet === MAGIC_SUCCESS_WALLET ? "success" :
            details.wallet === MAGIC_FAIL_WALLET    ? "declined" :
            pickOutcome();
    }

    return {
        status: outcome,
        transactionId: outcome === "success"
            ? `${method.toUpperCase()}-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
            : null,
        message: outcome === "success"
            ? `${method === "netbanking" ? "Net Banking" : "Wallet"} payment successful!`
            : "Payment could not be completed. Please try again.",
        timestamp: new Date().toISOString(),
        amount,
        method,
    };
}

/**
 * Main entry point — dispatches to the right payment handler.
 * @param details  - Payment details collected from the UI
 * @param amount   - Total amount in INR (₹)
 */
export async function simulatePayment(details: PaymentDetails, amount: number): Promise<PaymentResult> {
    switch (details.method) {
        case "card":
            return processCardPayment(details, amount);
        case "upi":
            return processUpiPayment(details, amount);
        case "netbanking":
        case "wallet":
            return processSimplePayment(details.method, amount, details);
        default:
            return {
                status: "failed",
                transactionId: null,
                message: "Unknown payment method.",
                timestamp: new Date().toISOString(),
                amount,
                method: details.method,
            };
    }
}
