"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductInput } from "@/lib/validations/product";
import { createProduct, updateProduct } from "@/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useTransition } from "react";

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: Category[];
  product?: {
    id: string;
    title: string;
    sku: string | null;
    description: string | null;
    shortDescription: string | null;
    price: string;
    compareAtPrice: string | null;
    stock: number;
    brand: string | null;
    categoryId: string;
    isLocal: boolean;
    isFeatured: boolean;
    isActive: boolean;
    weight: string | null;
    width: string | null;
    height: string | null;
    length: string | null;
  };
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedCategory, setSelectedCategory] = useState(
    product?.categoryId ?? ""
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      title: product?.title ?? "",
      sku: product?.sku ?? "",
      description: product?.description ?? "",
      shortDescription: product?.shortDescription ?? "",
      price: product?.price ? Number(product.price) : undefined,
      compareAtPrice: product?.compareAtPrice
        ? Number(product.compareAtPrice)
        : undefined,
      stock: product?.stock ?? 0,
      brand: product?.brand ?? "",
      categoryId: product?.categoryId ?? "",
      isLocal: product?.isLocal ?? true,
      isFeatured: product?.isFeatured ?? false,
      isActive: product?.isActive ?? true,
      weight: product?.weight ? Number(product.weight) : undefined,
      width: product?.width ? Number(product.width) : undefined,
      height: product?.height ? Number(product.height) : undefined,
      length: product?.length ? Number(product.length) : undefined,
    },
  });

  const isLocal = watch("isLocal");
  const isFeatured = watch("isFeatured");
  const isActive = watch("isActive");

  function onSubmit(data: ProductInput) {
    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("title", data.title);
      if (data.sku) formData.set("sku", data.sku);
      if (data.description) formData.set("description", data.description);
      if (data.shortDescription)
        formData.set("shortDescription", data.shortDescription);
      formData.set("price", String(data.price));
      if (data.compareAtPrice)
        formData.set("compareAtPrice", String(data.compareAtPrice));
      formData.set("stock", String(data.stock));
      if (data.brand) formData.set("brand", data.brand);
      formData.set("categoryId", data.categoryId);
      if (data.isLocal) formData.set("isLocal", "on");
      if (data.isFeatured) formData.set("isFeatured", "on");
      if (data.isActive) formData.set("isActive", "on");
      if (data.weight) formData.set("weight", String(data.weight));
      if (data.width) formData.set("width", String(data.width));
      if (data.height) formData.set("height", String(data.height));
      if (data.length) formData.set("length", String(data.length));

      const result = product
        ? await updateProduct(product.id, formData)
        : await createProduct(formData);

      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Product Title *</Label>
            <Input
              id="title"
              placeholder="Enter product title"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                placeholder="e.g. PROD-001"
                {...register("sku")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                placeholder="Brand name"
                {...register("brand")}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="shortDescription">Short Description</Label>
            <Input
              id="shortDescription"
              placeholder="Brief product summary"
              {...register("shortDescription")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Full Description</Label>
            <Textarea
              id="description"
              placeholder="Detailed product description"
              rows={5}
              {...register("description")}
            />
          </div>
        </div>
      </div>

      {/* Pricing & Stock */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Pricing & Stock</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="price">Price (ZMW) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="compareAtPrice">Compare At Price</Label>
            <Input
              id="compareAtPrice"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register("compareAtPrice", { valueAsNumber: true })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="stock">Stock Quantity *</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              placeholder="0"
              {...register("stock", { valueAsNumber: true })}
            />
            {errors.stock && (
              <p className="text-sm text-destructive">{errors.stock.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Category */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Organization</h2>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Category *</Label>
            <Select
              value={selectedCategory}
              onValueChange={(val) => {
                setSelectedCategory(val as string);
                setValue("categoryId", val as string, { shouldValidate: true });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-sm text-destructive">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <Separator />

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={isLocal}
                onCheckedChange={(checked: boolean) =>
                  setValue("isLocal", checked)
                }
              />
              <span className="text-sm">Local Product</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={isFeatured}
                onCheckedChange={(checked: boolean) =>
                  setValue("isFeatured", checked)
                }
              />
              <span className="text-sm">Featured</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={isActive}
                onCheckedChange={(checked: boolean) =>
                  setValue("isActive", checked)
                }
              />
              <span className="text-sm">Active</span>
            </label>
          </div>
        </div>
      </div>

      {/* Dimensions */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">
          Shipping Dimensions (Optional)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register("weight", { valueAsNumber: true })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="width">Width (cm)</Label>
            <Input
              id="width"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register("width", { valueAsNumber: true })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register("height", { valueAsNumber: true })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="length">Length (cm)</Label>
            <Input
              id="length"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register("length", { valueAsNumber: true })}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <a href="/vendor/products">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </a>
        <Button type="submit" disabled={isPending}>
          {isPending
            ? product
              ? "Updating..."
              : "Creating..."
            : product
              ? "Update Product"
              : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
