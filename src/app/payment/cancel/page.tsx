import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-red-500">
        Payment Cancelled
      </h1>

      <p className="mt-3">
        Your payment was not completed.
      </p>

      <Link
        href="/dashboard"
        className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}