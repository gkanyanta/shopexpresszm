export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { StoreSettingsForm } from "./_components/store-settings-form";

export default async function VendorStorePage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "VENDOR") {
    redirect("/auth/signin");
  }

  const vendorProfile = await db.vendorProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendorProfile) {
    redirect("/auth/signin");
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Store Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your store profile and contact information
        </p>
      </div>

      <StoreSettingsForm
        profile={{
          id: vendorProfile.id,
          businessName: vendorProfile.businessName,
          description: vendorProfile.description,
          phone: vendorProfile.phone,
          email: vendorProfile.email,
          address: vendorProfile.address,
          city: vendorProfile.city,
        }}
      />
    </div>
  );
}
