import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BannerForm,
  BannerDeleteButton,
  FAQForm,
  FAQDeleteButton,
  SiteContentForm,
} from "./client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "CMS Management - Admin",
};

export default async function AdminCMSPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const [banners, faqs, siteContent] = await Promise.all([
    db.banner.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
    db.fAQ.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
    db.siteContent.findMany({ orderBy: { key: "asc" } }),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">CMS Management</h1>
        <p className="text-zinc-500 text-sm">
          Manage banners, FAQs, and site content
        </p>
      </div>

      <Tabs defaultValue="banners">
        <TabsList>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
        </TabsList>

        {/* ─── BANNERS TAB ─────────────────────────────── */}
        <TabsContent value="banners">
          <div className="bg-white rounded-xl border p-6 mb-6">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">
              Create Banner
            </h2>
            <BannerForm />
          </div>

          <div className="bg-white rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Subtitle</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-zinc-400"
                    >
                      No banners created
                    </TableCell>
                  </TableRow>
                ) : (
                  banners.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell className="font-medium">
                        {banner.title}
                      </TableCell>
                      <TableCell className="text-zinc-600 max-w-[150px] truncate">
                        {banner.subtitle || "-"}
                      </TableCell>
                      <TableCell>
                        <a
                          href={banner.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-xs underline"
                        >
                          View
                        </a>
                      </TableCell>
                      <TableCell className="text-zinc-600 text-xs max-w-[120px] truncate">
                        {banner.linkUrl || "-"}
                      </TableCell>
                      <TableCell className="text-zinc-600">
                        {banner.sortOrder}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={banner.isActive ? "default" : "secondary"}
                        >
                          {banner.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <BannerDeleteButton bannerId={banner.id} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* ─── FAQS TAB ────────────────────────────────── */}
        <TabsContent value="faqs">
          <div className="bg-white rounded-xl border p-6 mb-6">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">
              Create FAQ
            </h2>
            <FAQForm />
          </div>

          <div className="bg-white rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faqs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-zinc-400"
                    >
                      No FAQs created
                    </TableCell>
                  </TableRow>
                ) : (
                  faqs.map((faq) => (
                    <TableRow key={faq.id}>
                      <TableCell className="font-medium max-w-[300px]">
                        <p className="truncate">{faq.question}</p>
                        <p className="text-xs text-zinc-400 truncate mt-1">
                          {faq.answer}
                        </p>
                      </TableCell>
                      <TableCell className="text-zinc-600">
                        {faq.category || "-"}
                      </TableCell>
                      <TableCell className="text-zinc-600">
                        {faq.sortOrder}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={faq.isActive ? "default" : "secondary"}
                        >
                          {faq.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <FAQDeleteButton faqId={faq.id} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* ─── PAGES TAB ───────────────────────────────── */}
        <TabsContent value="pages">
          <div className="bg-white rounded-xl border p-6 mb-6">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">
              Site Content
            </h2>
            <SiteContentForm />
          </div>

          {siteContent.length > 0 && (
            <div className="bg-white rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {siteContent.map((content) => (
                    <TableRow key={content.id}>
                      <TableCell className="font-mono text-xs font-medium">
                        {content.key}
                      </TableCell>
                      <TableCell className="text-zinc-600">
                        {content.title || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={content.isActive ? "default" : "secondary"}
                        >
                          {content.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-zinc-600">
                        {formatDate(content.updatedAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
