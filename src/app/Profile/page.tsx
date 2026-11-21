import { redirect } from "next/navigation";

// The Update Profile page now lives at /dashboard/profile (shared by every role).
export default function LegacyProfilePage() {
  redirect("/dashboard/profile");
}
