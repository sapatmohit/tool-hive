/**
 * PaymentModal.tsx — Multi-step Payment Gateway Simulation Modal
 *
 * Steps:
 *   1. BOOKING    — date picker + summary
 *   2. PAYMENT    — card / UPI / net banking / wallet selector + form
 *   3. PROCESSING — animated loading state
 *   4. RESULT     — success (TXN ID) or failure
 *
 * ⚠️  IMPORTANT: Sub-sections are rendered as inline JSX variables (not as
 *     inner arrow-function components). Defining them as `const Foo = () => ...`
 *     inside the parent and using `<Foo />` causes React to unmount+remount on
 *     every keystroke because the function reference is recreated, stealing
 *     input focus. Using bare JSX variables avoids this entirely.
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import {
    IoCardOutline,
    IoPhonePortraitOutline,
    IoGlobeOutline,
    IoWalletOutline,
    IoCheckmarkCircle,
    IoCloseCircle,
    IoArrowBack,
    IoLockClosedOutline,
    IoShieldCheckmarkOutline,
    IoRefreshOutline,
    IoCopyOutline,
} from "react-icons/io5";

import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { simulatePayment, PaymentMethod, PaymentDetails, PaymentResult } from "@/services/paymentService";
import { Tool } from "@/types";

/* ── Types ────────────────────────────────────────────────────────────────── */

type Step = "booking" | "payment" | "processing" | "result";

export interface BookingForm {
    startDate: string;
    endDate: string;
    message: string;
}

interface CardForm {
    cardNumber: string;
    cardHolder: string;
    expiry: string;
    cvv: string;
}

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    tool: Tool;
    onSuccess: (result: PaymentResult, booking: BookingForm) => void;
}

/* ── Static helpers (outside component – never recreated) ─────────────────── */

function formatCardNumber(raw: string) {
    return raw.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

function calcDays(start: string, end: string) {
    if (!start || !end) return 1;
    return Math.max(1, Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86_400_000) + 1);
}

/* ── StepIndicator (pure / no internal state – safe as component) ─────────── */

function StepIndicator({ step }: { step: Step }) {
    const steps: { id: Step; label: string }[] = [
        { id: "booking", label: "Booking" },
        { id: "payment", label: "Payment" },
        { id: "result", label: "Done" },
    ];
    const activeIdx = step === "processing" ? 1 : steps.findIndex((s) => s.id === step);

    return (
        <div className="flex items-center justify-center gap-2 mb-6">
            {steps.map((s, i) => (
                <div key={s.id} className="flex items-center gap-2">
                    <div
                        className={[
                            "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                            i < activeIdx
                                ? "bg-[#FF385C] text-white"
                                : i === activeIdx
                                    ? "bg-[#FF385C] text-white ring-4 ring-[#FF385C]/20"
                                    : "bg-gray-100 text-gray-400",
                        ].join(" ")}
                    >
                        {i < activeIdx ? "✓" : i + 1}
                    </div>
                    <span className={`text-xs font-semibold hidden sm:block ${i === activeIdx ? "text-[#FF385C]" : "text-gray-400"}`}>
                        {s.label}
                    </span>
                    {i < steps.length - 1 && (
                        <div className={`h-0.5 w-8 rounded-full transition-all duration-300 ${i < activeIdx ? "bg-[#FF385C]" : "bg-gray-200"}`} />
                    )}
                </div>
            ))}
        </div>
    );
}

/* ── ProcessingScreen (pure / no inputs – safe as component) ──────────────── */

function ProcessingScreen() {
    return (
        <div className="flex flex-col items-center justify-center py-12 gap-6">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full border-4 border-[#FF385C]/20" />
                <div className="absolute inset-0 rounded-full border-4 border-t-[#FF385C] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <IoLockClosedOutline className="text-[#FF385C] text-3xl" />
                </div>
            </div>
            <div className="text-center">
                <p className="font-bold text-gray-900 text-lg">Processing Payment</p>
                <p className="text-gray-500 text-sm mt-1">Please wait, contacting your bank…</p>
            </div>
            <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                    <span
                        key={i}
                        className="w-2 h-2 rounded-full bg-[#FF385C]"
                        style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
                    />
                ))}
            </div>
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
                <IoShieldCheckmarkOutline className="text-emerald-500 text-base" />
                256-bit SSL encrypted
            </p>
        </div>
    );
}

/* ── Main Component ───────────────────────────────────────────────────────── */

const BANKS = [
    { id: "sbi", label: "State Bank of India" },
    { id: "hdfc", label: "HDFC Bank" },
    { id: "icici", label: "ICICI Bank" },
    { id: "axis", label: "Axis Bank" },
    { id: "kotak", label: "Kotak Mahindra" },
    { id: "pnb", label: "Punjab National Bank" },
];

const WALLETS = [
    { id: "paytm", label: "Paytm", emoji: "₹" },
    { id: "gpay", label: "Google Pay", emoji: "G" },
    { id: "phonepe", label: "PhonePe", emoji: "P" },
    { id: "amazon", label: "Amazon Pay", emoji: "A" },
];

const UPI_APPS = [
    { id: "gpay", label: "GPay", emoji: "G" },
    { id: "phonepe", label: "PhonePe", emoji: "P" },
    { id: "paytm", label: "Paytm", emoji: "₹" },
];

export default function PaymentModal({ isOpen, onClose, tool, onSuccess }: PaymentModalProps) {
    const [step, setStep] = useState<Step>("booking");
    const [booking, setBooking] = useState<BookingForm>({ startDate: "", endDate: "", message: "" });
    const [method, setMethod] = useState<PaymentMethod>("card");
    const [card, setCard] = useState<CardForm>({ cardNumber: "", cardHolder: "", expiry: "", cvv: "" });
    const [upiId, setUpiId] = useState("");
    const [selectedBank, setSelectedBank] = useState("sbi");
    const [selectedWallet, setSelectedWallet] = useState("paytm");
    const [result, setResult] = useState<PaymentResult | null>(null);
    const [copied, setCopied] = useState(false);
    const [bookingError, setBookingError] = useState("");

    const days = calcDays(booking.startDate, booking.endDate);
    const totalAmount = Math.round(tool.pricePerDay * days);

    // Reset on open
    useEffect(() => {
        if (isOpen) {
            setStep("booking");
            setBooking({ startDate: "", endDate: "", message: "" });
            setCard({ cardNumber: "", cardHolder: "", expiry: "", cvv: "" });
            setUpiId("");
            setResult(null);
            setBookingError("");
        }
    }, [isOpen]);

    /* ── Handlers ───────────────────────────────────────────────────────── */

    const handleBookingNext = () => {
        if (!booking.startDate || !booking.endDate) {
            setBookingError("Please select both start and end dates.");
            return;
        }
        if (new Date(booking.endDate) < new Date(booking.startDate)) {
            setBookingError("End date must be after start date.");
            return;
        }
        setBookingError("");
        setStep("payment");
    };

    const handlePay = useCallback(async () => {
        setStep("processing");
        const details: PaymentDetails = {
            method,
            cardNumber: card.cardNumber.replace(/\s/g, ""),
            cardHolder: card.cardHolder,
            expiry: card.expiry,
            cvv: card.cvv,
            upiId,
            bank: selectedBank,
            wallet: selectedWallet,
        };
        const paymentResult = await simulatePayment(details, totalAmount);
        setResult(paymentResult);
        setStep("result");
        if (paymentResult.status === "success") {
            onSuccess(paymentResult, booking);
        }
    }, [method, card, upiId, selectedBank, selectedWallet, totalAmount, booking, onSuccess]);

    const handleRetry = () => { setStep("payment"); setResult(null); };

    const copyTxn = () => {
        if (result?.transactionId) {
            navigator.clipboard.writeText(result.transactionId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    /* ── Inline JSX (NOT inner components — preserves input focus) ─────── */

    const orderSummaryJSX = (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3.5 flex items-center justify-between mb-5 border border-gray-200">
            <div>
                <p className="font-bold text-gray-900 text-sm leading-tight">{tool.name}</p>
                <p className="text-gray-500 text-xs mt-0.5">
                    {booking.startDate && booking.endDate
                        ? `${days} day${days > 1 ? "s" : ""} · ${new Date(booking.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${new Date(booking.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
                        : `₹${tool.pricePerDay}/day`}
                </p>
            </div>
            <div className="text-right">
                <p className="font-extrabold text-gray-900 text-lg">₹{totalAmount}</p>
                <p className="text-gray-400 text-xs">Total</p>
            </div>
        </div>
    );

    /* ── STEP 1: Booking ─────────────────────────────────────────────────── */
    const bookingStepJSX = (
        <div>
            <StepIndicator step="booking" />
            {orderSummaryJSX}

            <div className="grid grid-cols-2 gap-3 mb-3">
                <Input
                    id="pay-start"
                    label="Start Date"
                    type="date"
                    value={booking.startDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setBooking((p) => ({ ...p, startDate: e.target.value }))}
                    required
                />
                <Input
                    id="pay-end"
                    label="End Date"
                    type="date"
                    value={booking.endDate}
                    min={booking.startDate || new Date().toISOString().split("T")[0]}
                    onChange={(e) => setBooking((p) => ({ ...p, endDate: e.target.value }))}
                    required
                />
            </div>

            {booking.startDate && booking.endDate && (
                <div className="bg-[#FF385C]/5 border border-[#FF385C]/20 rounded-xl px-4 py-3 mb-3 flex justify-between items-center">
                    <span className="text-sm text-[#FF385C] font-semibold">
                        {days} day{days > 1 ? "s" : ""} rental
                    </span>
                    <span className="font-extrabold text-gray-900">₹{totalAmount}</span>
                </div>
            )}

            <div className="flex flex-col gap-1.5 mb-4">
                <label htmlFor="pay-msg" className="text-sm font-semibold text-gray-700">
                    Message to owner <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                    id="pay-msg"
                    rows={2}
                    placeholder="Tell the owner why you need it…"
                    value={booking.message}
                    onChange={(e) => setBooking((p) => ({ ...p, message: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900
                     resize-none outline-none focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 transition-all"
                />
            </div>

            {bookingError && <p className="text-red-500 text-xs mb-3">{bookingError}</p>}

            <Button variant="primary" size="lg" fullWidth onClick={handleBookingNext}>
                Continue to Payment →
            </Button>
        </div>
    );

    /* ── STEP 2: Payment ─────────────────────────────────────────────────── */

    const paymentMethods: { id: PaymentMethod; label: string; icon: React.ReactNode }[] = [
        { id: "card", label: "Card", icon: <IoCardOutline className="text-lg" /> },
        { id: "upi", label: "UPI", icon: <IoPhonePortraitOutline className="text-lg" /> },
        { id: "netbanking", label: "Net Banking", icon: <IoGlobeOutline className="text-lg" /> },
        { id: "wallet", label: "Wallet", icon: <IoWalletOutline className="text-lg" /> },
    ];

    const paymentStepJSX = (
        <div>
            <StepIndicator step="payment" />
            {orderSummaryJSX}

            {/* Method tabs */}
            <div className="flex gap-2 mb-5 p-1 bg-gray-100 rounded-xl">
                {paymentMethods.map((m) => (
                    <button
                        key={m.id}
                        onClick={() => setMethod(m.id)}
                        className={[
                            "flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer",
                            method === m.id ? "bg-white text-[#FF385C] shadow-sm" : "text-gray-500 hover:text-gray-700",
                        ].join(" ")}
                    >
                        {m.icon}
                        <span className="hidden sm:block">{m.label}</span>
                    </button>
                ))}
            </div>

            {/* ── Card ── */}
            {method === "card" && (
                <div className="space-y-3">
                    {/* Live card preview */}
                    <div className="relative h-36 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-5 text-white overflow-hidden mb-4 shadow-lg">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">Debit / Credit</span>
                                <IoCardOutline className="text-2xl text-white/60" />
                            </div>
                            <div>
                                <p className="font-mono text-base tracking-widest text-white/90 mb-1">
                                    {card.cardNumber || "•••• •••• •••• ••••"}
                                </p>
                                <div className="flex justify-between items-end">
                                    <span className="text-xs text-white/60 font-semibold">{card.cardHolder || "CARD HOLDER"}</span>
                                    <span className="text-xs text-white/60">{card.expiry || "MM/YY"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Input
                        id="cc-num"
                        label="Card Number"
                        placeholder="1234 5678 9012 3456"
                        value={card.cardNumber}
                        onChange={(e) => setCard((p) => ({ ...p, cardNumber: formatCardNumber(e.target.value) }))}
                        prefix={<IoCardOutline />}
                    />
                    <Input
                        id="cc-name"
                        label="Card Holder Name"
                        placeholder="As printed on card"
                        value={card.cardHolder}
                        onChange={(e) => setCard((p) => ({ ...p, cardHolder: e.target.value.toUpperCase() }))}
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            id="cc-exp"
                            label="Expiry"
                            placeholder="MM/YY"
                            value={card.expiry}
                            onChange={(e) => setCard((p) => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                        />
                        <Input
                            id="cc-cvv"
                            label="CVV"
                            type="password"
                            placeholder="•••"
                            value={card.cvv}
                            onChange={(e) => setCard((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                            suffix={<IoLockClosedOutline />}
                        />
                    </div>
                </div>
            )}

            {/* ── UPI ── */}
            {method === "upi" && (
                <div className="space-y-4">
                    <Input
                        id="upi-id"
                        label="UPI ID"
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        prefix="@"
                    />
                    <div className="grid grid-cols-3 gap-2">
                        {UPI_APPS.map((app) => (
                            <button
                                key={app.id}
                                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 border-gray-100 hover:border-[#FF385C]/40 hover:bg-[#FF385C]/5 transition-all cursor-pointer"
                            >
                                <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-700">
                                    {app.emoji}
                                </span>
                                <span className="text-xs font-semibold text-gray-600">{app.label}</span>
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 text-center">
                        A payment request will be sent to your UPI app
                    </p>
                </div>
            )}

            {/* ── Net Banking ── */}
            {method === "netbanking" && (
                <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 block">Select Your Bank</label>
                    <div className="grid grid-cols-2 gap-2">
                        {BANKS.map((b) => (
                            <button
                                key={b.id}
                                onClick={() => setSelectedBank(b.id)}
                                className={[
                                    "text-left px-3 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all cursor-pointer",
                                    selectedBank === b.id
                                        ? "border-[#FF385C] bg-[#FF385C]/5 text-[#FF385C]"
                                        : "border-gray-100 text-gray-700 hover:border-gray-300",
                                ].join(" ")}
                            >
                                {b.label}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-2">
                        You will be redirected to your bank&apos;s secure page
                    </p>
                </div>
            )}

            {/* ── Wallet ── */}
            {method === "wallet" && (
                <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 block">Choose Wallet</label>
                    <div className="grid grid-cols-2 gap-2">
                        {WALLETS.map((w) => (
                            <button
                                key={w.id}
                                onClick={() => setSelectedWallet(w.id)}
                                className={[
                                    "flex items-center gap-2 px-3 py-3 rounded-xl border-2 text-xs font-semibold transition-all cursor-pointer",
                                    selectedWallet === w.id
                                        ? "border-[#FF385C] bg-[#FF385C]/5 text-[#FF385C]"
                                        : "border-gray-100 text-gray-700 hover:border-gray-300",
                                ].join(" ")}
                            >
                                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                    {w.emoji}
                                </span>
                                {w.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* CTA */}
            <div className="mt-5 space-y-2">
                <Button variant="primary" size="lg" fullWidth onClick={handlePay}>
                    <IoLockClosedOutline className="text-base" />
                    Pay ₹{totalAmount} Securely
                </Button>
                <button
                    onClick={() => setStep("booking")}
                    className="w-full flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 py-2 transition-colors cursor-pointer"
                >
                    <IoArrowBack className="text-base" /> Back to booking details
                </button>
                <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1.5">
                    <IoShieldCheckmarkOutline className="text-emerald-500 text-base" />
                    Secured by 256-bit SSL · No card data stored
                </p>
            </div>
        </div>
    );

    /* ── STEP 4: Result ──────────────────────────────────────────────────── */
    const isSuccess = result?.status === "success";
    const resultStepJSX = result ? (
        <div className="text-center">
            <StepIndicator step="result" />

            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${isSuccess ? "bg-emerald-50" : "bg-red-50"}`}>
                {isSuccess
                    ? <IoCheckmarkCircle className="text-5xl text-emerald-500" />
                    : <IoCloseCircle className="text-5xl text-red-400" />}
            </div>

            <h3 className={`text-xl font-extrabold mb-1 ${isSuccess ? "text-emerald-700" : "text-red-600"}`}>
                {isSuccess ? "Payment Successful!" : result.status === "declined" ? "Payment Declined" : "Payment Failed"}
            </h3>
            <p className="text-gray-500 text-sm mb-5 leading-relaxed">{result.message}</p>

            {isSuccess && result.transactionId && (
                <div className="bg-gray-50 rounded-xl p-4 mb-5 text-left space-y-2 border border-gray-200">
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500 font-semibold">Transaction ID</span>
                        <button
                            onClick={copyTxn}
                            className="flex items-center gap-1 text-[#FF385C] font-semibold hover:underline cursor-pointer"
                        >
                            <IoCopyOutline />
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                    <p className="font-mono text-xs text-gray-700 break-all bg-white border border-gray-200 rounded-lg px-3 py-2">
                        {result.transactionId}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs mt-1 pt-2 border-t border-gray-100">
                        <div>
                            <span className="text-gray-400">Amount Paid</span>
                            <p className="font-bold text-gray-900">₹{result.amount}</p>
                        </div>
                        <div>
                            <span className="text-gray-400">Method</span>
                            <p className="font-bold text-gray-900 capitalize">{result.method}</p>
                        </div>
                        <div>
                            <span className="text-gray-400">Date</span>
                            <p className="font-bold text-gray-900">
                                {new Date(result.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                        </div>
                        <div>
                            <span className="text-gray-400">Status</span>
                            <p className="font-bold text-emerald-600">Confirmed</p>
                        </div>
                    </div>
                </div>
            )}

            {isSuccess ? (
                <Button variant="primary" size="lg" fullWidth onClick={onClose}>
                    Done — View My Borrows
                </Button>
            ) : (
                <div className="space-y-2">
                    <Button variant="primary" size="lg" fullWidth onClick={handleRetry}>
                        <IoRefreshOutline /> Try Again
                    </Button>
                    <Button variant="ghost" size="md" fullWidth onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            )}
        </div>
    ) : null;

    /* ── Render ─────────────────────────────────────────────────────────── */

    const titleMap: Record<Step, string> = {
        booking: "Book Tool",
        payment: "Secure Payment",
        processing: "Processing…",
        result: isSuccess ? "Booking Confirmed" : "Payment Issue",
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={step === "processing" ? () => { } : onClose}
            title={titleMap[step]}
            size="md"
        >
            {step === "booking" && bookingStepJSX}
            {step === "payment" && paymentStepJSX}
            {step === "processing" && <ProcessingScreen />}
            {step === "result" && resultStepJSX}
        </Modal>
    );
}
