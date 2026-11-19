
"use client";

import { useEffect, useState, FormEvent } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Profile = {
  name: string;
  email: string;
  role: string;
  phone: string;
  bio: string;
  image: string;
};

const initialProfile: Profile = {
  name: "",
  email: "",
  role: "",
  phone: "",
  bio: "",
  image: "",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load profile
  useEffect(() => {
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
          throw new Error(result.message || "Failed to load profile");
        }

        setProfile({
          ...initialProfile,
          ...result.user,
        });
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ImgBB image upload through backend
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB");
      e.target.value = "";
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
        throw new Error(result.message || "Image upload failed");
      }

      if (!result.imageUrl) {
        throw new Error("Image URL was not returned");
      }

      setProfile((prev) => ({
        ...prev,
        image: result.imageUrl,
      }));

      toast.success("Image uploaded successfully! Click Save Changes.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Image upload failed"
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // Save profile
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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

      const response = await fetch(`${API_URL}/api/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          bio: profile.bio,
          image: profile.image,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Profile update failed");
      }

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="mt-2 text-gray-500">
          Manage your personal information.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm"
      >
        {/* Profile Picture */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border">
            <Image
              src={profile.image || "/default-avatar.png"}
              alt="Profile"
              fill
              sizes="96px"
              unoptimized
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <label className="mb-2 block font-medium">
              Upload Profile Picture
            </label>

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageUpload}
              disabled={uploading}
              className="w-full rounded-lg border p-3"
            />

            <p className="mt-2 text-xs text-gray-500">
              PNG, JPG or WEBP. Maximum size 5 MB.
            </p>

            {uploading && (
              <p className="mt-2 text-sm font-medium text-blue-600">
                Uploading image...
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Or Enter Profile Picture URL
          </label>

          <input
            type="url"
            name="image"
            value={profile.image}
            onChange={handleChange}
            placeholder="https://example.com/photo.jpg"
            className="w-full rounded-lg border p-3"
          />
        </div>

        {/* Name */}
        <div>
          <label className="mb-2 block font-medium">Full Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            required
            maxLength={100}
            className="w-full rounded-lg border p-3"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 block font-medium">Email</label>
          <input
            type="email"
            value={profile.email}
            readOnly
            className="w-full rounded-lg border bg-gray-100 p-3"
          />
        </div>

        {/* Role */}
        <div>
          <label className="mb-2 block font-medium">Account Role</label>
          <input
            type="text"
            value={profile.role}
            readOnly
            className="w-full rounded-lg border bg-gray-100 p-3 capitalize"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="mb-2 block font-medium">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            maxLength={20}
            placeholder="Enter your phone number"
            className="w-full rounded-lg border p-3"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="mb-2 block font-medium">Bio</label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            maxLength={500}
            rows={5}
            placeholder="Tell us something about yourself..."
            className="w-full resize-none rounded-lg border p-3"
          />

          <p className="mt-1 text-right text-xs text-gray-500">
            {profile.bio.length}/500
          </p>
        </div>

        {/* Save */}
        <button
          type="submit"
          disabled={saving || uploading}
          className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : uploading
              ? "Uploading Image..."
              : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
