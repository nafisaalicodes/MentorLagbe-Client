
"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type DragEvent,
  type ChangeEvent,
} from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
  Camera,
  UploadCloud,
  User,
  Mail,
  ShieldCheck,
  Phone,
  FileText,
  Link2,
  Loader2,
  CheckCircle2,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Profile = {
  name: string;
  email: string;
  role: string;
  phone: string;
  bio: string;
  image: string;
  plan?: string;
};

const initialProfile: Profile = {
  name: "",
  email: "",
  role: "",
  phone: "",
  bio: "",
  image: "",
  plan: "free",
};

const roleBadgeStyles: Record<string, string> = {
  student: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  tutor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  admin: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [savedProfile, setSavedProfile] =
    useState<Profile>(initialProfile);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [imgError, setImgError] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const hasUnsavedChanges =
    profile.name !== savedProfile.name ||
    profile.phone !== savedProfile.phone ||
    profile.bio !== savedProfile.bio ||
    profile.image !== savedProfile.image;

  // Load profile
  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        if (!API_URL) {
          throw new Error("API URL is not configured");
        }

        const { data, error } = await authClient.token();

        if (error || !data?.token) {
          throw new Error("Please sign in first");
        }

        const response = await fetch(`${API_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to load profile"
          );
        }

        const loaded: Profile = {
          ...initialProfile,
          ...result.user,
          phone: result.user?.phone || "",
          bio: result.user?.bio || "",
          image: result.user?.image || "",
          plan: result.user?.plan || "free",
        };

        if (isMounted) {
          setProfile(loaded);
          setSavedProfile(loaded);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Something went wrong"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  // Input change
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "image") {
      setImgError(false);
    }

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Shared file validation and ImgBB upload
  const processImageFile = async (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image (PNG, JPG, or WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB");
      return;
    }

    if (!API_URL) {
      toast.error("API URL is not configured");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);

    try {
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error("Please sign in first");
      }

      const response = await fetch(
        `${API_URL}/api/profile/upload-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Image upload failed"
        );
      }

      if (!result.imageUrl) {
        throw new Error("Image URL was not returned");
      }

      // Reset image error when a new image is uploaded
      setImgError(false);

      setProfile((prev) => ({
        ...prev,
        image: result.imageUrl,
      }));

      toast.success(
        "Photo uploaded! Click 'Save Changes' to apply."
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Image upload failed"
      );
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleImageUpload = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    processImageFile(e.target.files?.[0]);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (uploading) return;

    processImageFile(e.dataTransfer.files?.[0]);
  };

  // Reset unsaved changes
  const handleReset = () => {
    setImgError(false);
    setProfile(savedProfile);
    toast.info("Reverted unsaved changes");
  };

  // Save profile
  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (uploading) {
      toast.error("Please wait until image upload finishes");
      return;
    }

    if (!profile.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!API_URL) {
      toast.error("API URL is not configured");
      return;
    }

    setSaving(true);

    try {
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error("Please sign in first");
      }

      const payload = {
        name: profile.name.trim(),
        phone: profile.phone.trim(),
        bio: profile.bio.trim(),
        image: profile.image.trim(),
      };

      const response = await fetch(`${API_URL}/api/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Profile update failed"
        );
      }

      // Sync Better Auth session
      const { error: updateError } = await authClient.updateUser({
        name: payload.name,
        image: payload.image || undefined,
      });

      if (updateError) {
        console.error("Better Auth session update error:", updateError);
      }

      const updated: Profile = {
        ...profile,
        ...payload,
      };

      setProfile(updated);
      setSavedProfile(updated);

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  const normalizedRole =
    profile.role?.toLowerCase() || "student";

  const badgeStyle =
    roleBadgeStyles[normalizedRole] ||
    "bg-primary/10 text-primary border-primary/20";

  const initials =
    profile.name?.trim()?.charAt(0)?.toUpperCase() ||
    profile.email?.charAt(0)?.toUpperCase() ||
    "U";

  // Loading skeleton
  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-2">
          <div className="h-8 w-52 animate-pulse rounded-lg bg-muted" />
          <div className="h-4 w-80 max-w-full animate-pulse rounded-md bg-muted" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="h-80 animate-pulse rounded-2xl border border-border bg-card p-6" />
          </div>

          <div className="lg:col-span-8">
            <div className="h-[520px] animate-pulse rounded-2xl border border-border bg-card p-6" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Account Settings
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Customize your public MentorLagbe profile, avatar,
            and contact details.
          </p>
        </div>

        {hasUnsavedChanges && (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
            Unsaved changes
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Profile Preview */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-emerald-500/15" />

            <div className="px-6 pb-6">
              {/* Avatar */}
              <div className="relative -mt-12 mb-4 inline-block">
                <div className="relative h-24 w-24 overflow-hidden rounded-2xl border-4 border-card bg-muted shadow-md">
                  {profile.image && !imgError ? (
                    <Image
                      src={profile.image}
                      alt={profile.name || "Profile"}
                      width={96}
                      height={96}
                      onError={() => setImgError(true)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/15 text-2xl font-bold text-primary">
                      {initials}
                    </div>
                  )}

                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[1px]">
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  title="Change profile picture"
                  className="absolute -bottom-1.5 -right-1.5 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              {/* Name and badges */}
              <div className="space-y-1.5">
                <h2 className="truncate text-lg font-bold text-foreground">
                  {profile.name || "Your Name"}
                </h2>

                <p className="truncate text-xs text-muted-foreground">
                  {profile.email}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${badgeStyle}`}
                  >
                    <ShieldCheck className="h-3 w-3" />
                    {profile.role || "Member"}
                  </span>

                  {profile.plan && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold uppercase text-purple-600">
                      <Sparkles className="h-3 w-3" />
                      {profile.plan} Plan
                    </span>
                  )}
                </div>
              </div>

              {/* Bio preview */}
              <div className="mt-5 border-t border-border pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  About
                </p>

                <p className="mt-1.5 break-words text-sm leading-relaxed text-foreground/85">
                  {profile.bio.trim()
                    ? profile.bio
                    : "Add a short bio so students and tutors can get to know your background and goals."}
                </p>
              </div>

              {/* Phone preview */}
              {profile.phone.trim() && (
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  <span>{profile.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="lg:col-span-8">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
          >
            {/* Profile Photo */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Profile Photo
              </label>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() =>
                  !uploading && fileInputRef.current?.click()
                }
                className={`group cursor-pointer rounded-xl border-2 border-dashed p-5 text-center transition ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/40"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />

                <div className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition group-hover:scale-105">
                  {uploading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <UploadCloud className="h-5 w-5" />
                  )}
                </div>

                <p className="text-sm font-medium text-foreground">
                  {uploading ? (
                    "Uploading to ImgBB..."
                  ) : (
                    <>
                      <span className="text-primary underline-offset-4 group-hover:underline">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </>
                  )}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  PNG, JPG, or WEBP up to 5 MB
                </p>
              </div>

              {/* Direct Image URL */}
              <div className="mt-3">
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Link2 className="h-3.5 w-3.5" />
                  Or paste a direct image URL
                </label>

                <input
                  type="url"
                  name="image"
                  value={profile.image}
                  onChange={handleChange}
                  placeholder="https://i.ibb.co/..."
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <hr className="border-border" />

            {/* Personal Information */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Full Name <span className="text-destructive">*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  maxLength={20}
                  placeholder="+880 1XXX-XXXXXX"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email Address
                </label>

                <input
                  type="email"
                  value={profile.email}
                  readOnly
                  className="w-full cursor-not-allowed rounded-xl border border-border bg-muted/60 px-3.5 py-2.5 text-sm text-muted-foreground"
                />
              </div>

              {/* Role */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  Account Role
                </label>

                <input
                  type="text"
                  value={profile.role}
                  readOnly
                  className="w-full cursor-not-allowed rounded-xl border border-border bg-muted/60 px-3.5 py-2.5 text-sm capitalize text-muted-foreground"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Bio
                </label>

                <span
                  className={`text-xs font-medium ${
                    profile.bio.length > 450
                      ? "text-amber-600"
                      : "text-muted-foreground"
                  }`}
                >
                  {profile.bio.length}/500
                </span>
              </div>

              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                maxLength={500}
                rows={4}
                placeholder="Share your academic background, teaching experience, or learning goals..."
                className="w-full resize-none rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
              {hasUnsavedChanges && (
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={saving || uploading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted disabled:opacity-50"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
              )}

              <button
                type="submit"
                disabled={
                  saving || uploading || !hasUnsavedChanges
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading Image...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
