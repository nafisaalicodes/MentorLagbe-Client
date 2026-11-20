import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-green-600">
        Payment Successful!
      </h1>

      <p className="mt-3">
        Thank you! Your payment is being processed.
      </p>

      <Link
        href="/dashboard"
        className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}