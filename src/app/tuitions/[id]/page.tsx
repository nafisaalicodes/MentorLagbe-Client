
import { Suspense } from "react";
import { notFound } from "next/navigation";
import TuitionDetailsClient from "./TuitionDetailsClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function TuitionDetailsContent({
  params,
}: PageProps) {
  const { id } = await params;

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  let tuition = null;

  try {
    const response = await fetch(
      `${API_URL}/api/tuitions/${encodeURIComponent(id)}`,
      {
        cache: "no-store",
      }
    );

    if (response.ok) {
      const result = await response.json();

      if (result.success && result.data) {
        tuition = result.data;
      }
    }
  } catch (error) {
    console.error("Tuition Details Fetch Error:", error);
  }

  if (!tuition) {
    notFound();
  }

  return <TuitionDetailsClient tuition={tuition} />;
}

export default function TuitionDetailsPage({
  params,
}: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading tuition details...
            </p>
          </div>
        </div>
      }
    >
      <TuitionDetailsContent params={params} />
    </Suspense>
  );
}
