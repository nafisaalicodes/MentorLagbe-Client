import ApplicantsClient from "./ApplicantsClient";

// Disable instant navigation validation for this route.
// The page will still render and stream normally.
export const instant = false;

export default function ApplicantsPage() {
  return <ApplicantsClient />;
}