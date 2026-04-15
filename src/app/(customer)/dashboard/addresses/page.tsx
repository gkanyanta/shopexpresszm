"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  getAddresses,
  createAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/actions/addresses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Plus,
  Trash2,
  Star,
  Loader2,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface Address {
  id: string;
  label: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  address1: string;
  address2: string | null;
  city: string;
  province: string;
  isDefault: boolean;
}

const PROVINCES = [
  "Lusaka", "Copperbelt", "Central", "Eastern", "Luapula",
  "Muchinga", "Northern", "North-Western", "Southern", "Western",
];

export default function AddressesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isPending, startTransition] = useTransition();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    label: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/dashboard/addresses");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      loadAddresses();
    }
  }, [status]);

  async function loadAddresses() {
    const result = await getAddresses();
    if (result.addresses) {
      setAddresses(result.addresses as Address[]);
    }
  }

  async function handleSubmit() {
    setError("");

    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.address1 || !formData.city || !formData.province) {
      setError("Please fill in all required fields");
      return;
    }

    startTransition(async () => {
      const result = await createAddress(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setShowForm(false);
        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          address1: "",
          address2: "",
          city: "",
          province: "",
          label: "",
        });
        await loadAddresses();
      }
    });
  }

  async function handleDelete(addressId: string) {
    if (!confirm("Are you sure you want to delete this address?")) return;

    startTransition(async () => {
      const result = await deleteAddress(addressId);
      if (result.error) {
        setError(result.error);
      } else {
        await loadAddresses();
      }
    });
  }

  async function handleSetDefault(addressId: string) {
    startTransition(async () => {
      const result = await setDefaultAddress(addressId);
      if (result.error) {
        setError(result.error);
      } else {
        await loadAddresses();
      }
    });
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Addresses</h1>
          <p className="text-sm text-muted-foreground">
            Manage your delivery addresses
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 size-4" />
            Add Address
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Add Address Form */}
      {showForm && (
        <div className="mb-6 rounded-lg border p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">New Address</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="label">Label (e.g. Home, Work)</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="address1">Address Line 1 *</Label>
              <Input
                id="address1"
                value={formData.address1}
                onChange={(e) =>
                  setFormData({ ...formData, address1: e.target.value })
                }
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="address2">Address Line 2</Label>
              <Input
                id="address2"
                value={formData.address2}
                onChange={(e) =>
                  setFormData({ ...formData, address2: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="province">Province *</Label>
              <Select
                value={formData.province}
                onValueChange={(val) =>
                  setFormData({ ...formData, province: val ?? "" })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent>
                  {PROVINCES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : null}
              Save Address
            </Button>
          </div>
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <MapPin className="mb-4 size-12 text-muted-foreground" />
          <h2 className="text-lg font-medium">No addresses saved</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a delivery address to get started.
          </p>
          <Button className="mt-4" onClick={() => setShowForm(true)}>
            <Plus className="mr-2 size-4" />
            Add Address
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`rounded-lg border p-4 ${
                addr.isDefault ? "border-primary bg-primary/5" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {addr.firstName} {addr.lastName}
                    </span>
                    {addr.label && <Badge variant="secondary">{addr.label}</Badge>}
                    {addr.isDefault && <Badge variant="outline">Default</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {addr.address1}
                    {addr.address2 ? `, ${addr.address2}` : ""}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {addr.city}, {addr.province}
                  </p>
                  <p className="text-sm text-muted-foreground">{addr.phone}</p>
                </div>
                <div className="flex gap-1">
                  {!addr.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(addr.id)}
                      disabled={isPending}
                      title="Set as default"
                    >
                      <Star className="size-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(addr.id)}
                    disabled={isPending}
                    title="Delete address"
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
