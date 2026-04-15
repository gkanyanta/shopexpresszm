"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { updateVendorProfile } from "@/actions/vendor-profile";

interface StoreSettingsFormProps {
  profile: {
    id: string;
    businessName: string;
    description: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    city: string | null;
  };
}

export function StoreSettingsForm({ profile }: StoreSettingsFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await updateVendorProfile(formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess("Store profile updated successfully.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg border border-green-200">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Business Information</h2>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              name="businessName"
              defaultValue={profile.businessName}
              placeholder="Your business name"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Store Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={profile.description ?? ""}
              placeholder="Tell customers about your store"
              rows={4}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={profile.phone ?? ""}
                placeholder="+260 97X XXX XXX"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Business Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={profile.email ?? ""}
                placeholder="store@example.com"
              />
            </div>
          </div>

          <Separator />

          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              defaultValue={profile.address ?? ""}
              placeholder="Street address"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              defaultValue={profile.city ?? ""}
              placeholder="e.g. Lusaka"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
