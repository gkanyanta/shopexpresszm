"use client";

import { useTransition } from "react";
import { updateUserRole, toggleUserStatus } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import type { Role } from "@prisma/client";

export function UserRoleForm({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: Role;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    startTransition(() => {
      updateUserRole(userId, e.target.value as Role);
    });
  }

  return (
    <select
      defaultValue={currentRole}
      onChange={handleChange}
      disabled={isPending}
      className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
    >
      <option value="GUEST">Guest</option>
      <option value="CUSTOMER">Customer</option>
      <option value="VENDOR">Vendor</option>
      <option value="ADMIN">Admin</option>
    </select>
  );
}

export function UserStatusButton({
  userId,
  isActive,
}: {
  userId: string;
  isActive: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant={isActive ? "destructive" : "default"}
      size="sm"
      disabled={isPending}
      onClick={() => startTransition(() => toggleUserStatus(userId))}
    >
      {isPending ? "..." : isActive ? "Deactivate" : "Activate"}
    </Button>
  );
}
