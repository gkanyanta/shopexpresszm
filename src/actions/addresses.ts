"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

interface CreateAddressInput {
  firstName: string;
  lastName: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  label?: string;
}

export async function getAddresses() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in", addresses: [] };
  }

  const addresses = await db.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return { addresses };
}

export async function createAddress(data: CreateAddressInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in" };
  }

  if (!data.firstName || !data.lastName || !data.phone || !data.address1 || !data.city || !data.province) {
    return { error: "Please fill in all required fields" };
  }

  // Check if this is the first address (make it default)
  const existingCount = await db.address.count({
    where: { userId: session.user.id },
  });

  const address = await db.address.create({
    data: {
      userId: session.user.id,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      address1: data.address1,
      address2: data.address2 || null,
      city: data.city,
      province: data.province,
      label: data.label || null,
      isDefault: existingCount === 0,
    },
  });

  return { success: true, address };
}

export async function deleteAddress(addressId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in" };
  }

  const address = await db.address.findFirst({
    where: { id: addressId, userId: session.user.id },
  });

  if (!address) {
    return { error: "Address not found" };
  }

  // Check if address is used in any orders
  const orderCount = await db.order.count({
    where: { addressId },
  });

  if (orderCount > 0) {
    return { error: "Cannot delete an address that is linked to existing orders" };
  }

  await db.address.delete({ where: { id: addressId } });

  // If the deleted address was default, set another as default
  if (address.isDefault) {
    const nextAddress = await db.address.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    if (nextAddress) {
      await db.address.update({
        where: { id: nextAddress.id },
        data: { isDefault: true },
      });
    }
  }

  return { success: true };
}

export async function setDefaultAddress(addressId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in" };
  }

  const address = await db.address.findFirst({
    where: { id: addressId, userId: session.user.id },
  });

  if (!address) {
    return { error: "Address not found" };
  }

  // Remove default from all addresses
  await db.address.updateMany({
    where: { userId: session.user.id },
    data: { isDefault: false },
  });

  // Set the new default
  await db.address.update({
    where: { id: addressId },
    data: { isDefault: true },
  });

  return { success: true };
}
