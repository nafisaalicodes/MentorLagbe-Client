import { Suspense } from "react";
import BrowseTution from "@/components/Browsetution/Browsetution";

type SearchParams = {
  search?: string;
  subject?: string;
  classLevel?: string;
  mode?: string;
};

export default function TuitionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">
            Loading tuitions...
          </p>
        </div>
      }
    >
      <BrowseTution searchParams={searchParams} />
    </Suspense>
  );
}