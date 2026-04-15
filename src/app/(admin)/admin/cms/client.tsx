"use client";

import { useTransition } from "react";
import {
  createBanner,
  deleteBanner,
  createFAQ,
  deleteFAQ,
  updateSiteContent,
} from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// ─── BANNER FORM ────────────────────────────────────────

export function BannerForm() {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      await createBanner({
        title: formData.get("title") as string,
        subtitle: (formData.get("subtitle") as string) || undefined,
        imageUrl: formData.get("imageUrl") as string,
        linkUrl: (formData.get("linkUrl") as string) || undefined,
        sortOrder: Number(formData.get("sortOrder") || 0),
        isActive: true,
      });
      (e.target as HTMLFormElement).reset();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="banner-title">Title</Label>
          <Input
            id="banner-title"
            name="title"
            placeholder="Banner title"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="banner-subtitle">Subtitle (optional)</Label>
          <Input
            id="banner-subtitle"
            name="subtitle"
            placeholder="Banner subtitle"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="banner-imageUrl">Image URL</Label>
          <Input
            id="banner-imageUrl"
            name="imageUrl"
            placeholder="https://..."
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="banner-linkUrl">Link URL (optional)</Label>
          <Input
            id="banner-linkUrl"
            name="linkUrl"
            placeholder="https://..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="banner-sortOrder">Sort Order</Label>
          <Input
            id="banner-sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={0}
          />
        </div>
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Banner"}
      </Button>
    </form>
  );
}

export function BannerDeleteButton({ bannerId }: { bannerId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (confirm("Delete this banner?")) {
          startTransition(() => deleteBanner(bannerId));
        }
      }}
    >
      {isPending ? "..." : "Delete"}
    </Button>
  );
}

// ─── FAQ FORM ───────────────────────────────────────────

export function FAQForm() {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      await createFAQ({
        question: formData.get("question") as string,
        answer: formData.get("answer") as string,
        category: (formData.get("category") as string) || undefined,
        sortOrder: Number(formData.get("sortOrder") || 0),
        isActive: true,
      });
      (e.target as HTMLFormElement).reset();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="faq-question">Question</Label>
        <Input
          id="faq-question"
          name="question"
          placeholder="Enter the question"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="faq-answer">Answer</Label>
        <Textarea
          id="faq-answer"
          name="answer"
          placeholder="Enter the answer"
          required
          rows={3}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="faq-category">Category (optional)</Label>
          <Input
            id="faq-category"
            name="category"
            placeholder="e.g. Shipping, Returns"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="faq-sortOrder">Sort Order</Label>
          <Input
            id="faq-sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={0}
          />
        </div>
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create FAQ"}
      </Button>
    </form>
  );
}

export function FAQDeleteButton({ faqId }: { faqId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (confirm("Delete this FAQ?")) {
          startTransition(() => deleteFAQ(faqId));
        }
      }}
    >
      {isPending ? "..." : "Delete"}
    </Button>
  );
}

// ─── SITE CONTENT FORM ─────────────────────────────────

export function SiteContentForm() {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const key = formData.get("key") as string;
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;

    startTransition(async () => {
      await updateSiteContent(key, {
        title,
        content: { body },
        isActive: true,
      });
      (e.target as HTMLFormElement).reset();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="content-key">Content Key</Label>
          <Input
            id="content-key"
            name="key"
            placeholder="e.g. about-us, terms, privacy"
            required
          />
          <p className="text-xs text-zinc-400">
            Unique identifier for this content block
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="content-title">Title</Label>
          <Input
            id="content-title"
            name="title"
            placeholder="Page title"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="content-body">Content Body</Label>
        <Textarea
          id="content-body"
          name="body"
          placeholder="Enter page content (supports HTML)"
          required
          rows={6}
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save Content"}
      </Button>
    </form>
  );
}
