"use client";

import { useTransition } from "react";
import { createCategory, deleteCategory } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CategoryForm({
  parentOptions,
}: {
  parentOptions: { id: string; name: string }[];
}) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const parentId = (formData.get("parentId") as string) || null;

    startTransition(async () => {
      await createCategory({ name, description, parentId });
      (e.target as HTMLFormElement).reset();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Category Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g. Electronics"
            required
          />
          <p className="text-xs text-zinc-400">
            Slug will be auto-generated from the name
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="parentId">Parent Category (optional)</Label>
          <select
            id="parentId"
            name="parentId"
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">None (Top Level)</option>
            {parentOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Brief description of the category"
          rows={2}
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Category"}
      </Button>
    </form>
  );
}

export function CategoryDeleteButton({
  categoryId,
  productCount,
}: {
  categoryId: string;
  productCount: number;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={isPending || productCount > 0}
      title={
        productCount > 0
          ? "Cannot delete category with products"
          : "Delete category"
      }
      onClick={() => {
        if (confirm("Are you sure you want to delete this category?")) {
          startTransition(() => deleteCategory(categoryId));
        }
      }}
    >
      {isPending ? "..." : "Delete"}
    </Button>
  );
}
