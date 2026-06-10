"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Eye, EyeOff, Upload } from "lucide-react";
import { InlineError } from "@/components/dashboard/LoadingStates";
import { useToast } from "@/components/dashboard/ToastProvider";
import { dashboardFetch, getErrorMessage, redirectIfAuthError } from "@/lib/dashboardApi";

type Blog = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  tags: string[];
  published: boolean;
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
};

type BlogForm = Omit<Blog, "_id" | "createdAt" | "tags"> & { tags: string };

const EMPTY: BlogForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  image: "",
  author: "GOPU Exports",
  tags: "",
  published: false,
  metaTitle: "",
  metaDescription: "",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0E7490]/30 focus:border-[#0E7490]"
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0E7490]/30 focus:border-[#0E7490] resize-none"
    />
  );
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [form, setForm] = useState<BlogForm>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      console.info("[dashboard/blogs] loading blog posts");
      const data = await dashboardFetch<Blog[]>("/api/blogs");
      console.info("[dashboard/blogs] loaded blog posts", { count: Array.isArray(data) ? data.length : 0 });
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("[dashboard/blogs] load failed", err);
      if (!redirectIfAuthError(err)) {
        setError(getErrorMessage(err, "Blog posts could not be loaded."));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(id);
  }, [load]);

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
  };

  const openEdit = (b: Blog) => {
    setEditing(b);
    setForm({
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt,
      content: b.content,
      image: b.image,
      author: b.author,
      tags: b.tags.join(", "),
      published: b.published,
      metaTitle: b.metaTitle,
      metaDescription: b.metaDescription,
    });
    setShowForm(true);
  };

  const set = (key: keyof BlogForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const uploadImage = async (file: File) => {
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("bucket", "blogs");
      const data = await dashboardFetch<{ url: string }>("/api/upload", {
        method: "POST",
        body: fd,
        timeoutMs: 30000,
      });
      setForm((f) => ({ ...f, image: data.url }));
      toast.success("Featured image uploaded.");
    } catch (err) {
      if (!redirectIfAuthError(err)) {
        toast.error(getErrorMessage(err, "Featured image upload failed."));
      }
    }
  };

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        metaTitle: form.metaTitle || form.title,
      };

      if (editing) {
        console.info("[dashboard/blogs] updating blog post", {
          id: editing._id,
          slug: payload.slug,
          published: payload.published,
        });
        const updated = await dashboardFetch<Blog>(`/api/blogs/${editing._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        console.info("[dashboard/blogs] blog post updated", {
          id: updated._id,
          slug: updated.slug,
          published: updated.published,
        });
        setBlogs((prev) => prev.map((b) => (b._id === editing._id ? updated : b)));
        toast.success(updated.published ? "Blog post updated and visible." : "Blog post updated as draft.");
      } else {
        console.info("[dashboard/blogs] creating blog post", {
          slug: payload.slug,
          published: payload.published,
        });
        const created = await dashboardFetch<Blog>("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        console.info("[dashboard/blogs] blog post created", {
          id: created._id,
          slug: created.slug,
          published: created.published,
        });
        setBlogs((prev) => [created, ...prev]);
        toast.success(created.published ? "Blog post published." : "Blog draft created.");
      }
      setShowForm(false);
    } catch (err) {
      console.error("[dashboard/blogs] save failed", err);
      if (!redirectIfAuthError(err)) {
        toast.error(getErrorMessage(err, "Blog post could not be saved."));
      }
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (b: Blog) => {
    try {
      console.info("[dashboard/blogs] updating publish status", {
        id: b._id,
        slug: b.slug,
        published: !b.published,
      });
      const updated = await dashboardFetch<Blog>(`/api/blogs/${b._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !b.published }),
      });
      console.info("[dashboard/blogs] publish status updated", {
        id: updated._id,
        slug: updated.slug,
        published: updated.published,
      });
      setBlogs((prev) => prev.map((x) => (x._id === b._id ? updated : x)));
      toast.success(updated.published ? "Blog post published." : "Blog post moved to draft.");
    } catch (err) {
      console.error("[dashboard/blogs] publish status update failed", err);
      if (!redirectIfAuthError(err)) {
        toast.error(getErrorMessage(err, "Publish status could not be updated."));
      }
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Archive this blog post? It will be hidden without being permanently deleted.")) return;
    try {
      console.info("[dashboard/blogs] archiving blog post", { id });
      await dashboardFetch<{ success: boolean }>(`/api/blogs/${id}`, { method: "DELETE" });
      console.info("[dashboard/blogs] blog post archived", { id });
      setBlogs((prev) => prev.filter((b) => b._id !== id));
      toast.success("Blog post archived.");
    } catch (err) {
      console.error("[dashboard/blogs] archive failed", err);
      if (!redirectIfAuthError(err)) {
        toast.error(getErrorMessage(err, "Blog post could not be archived."));
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0F172A]">Blog Posts</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {blogs.length} posts · {blogs.filter((b) => b.published).length} published
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-[#0E7490] hover:bg-[#0A5A70] transition text-white px-5 py-3 rounded-xl font-medium text-sm"
        >
          <Plus size={16} />
          New Post
        </button>
      </div>

      {error && <div className="mb-5"><InlineError message={error} onRetry={load} /></div>}

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Loading…</div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-sm gap-3">
            <span className="text-3xl">✍️</span>
            No blog posts yet.
            <button onClick={openNew} className="text-[#0E7490] font-semibold hover:underline">
              Write your first post →
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Post</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((b) => (
                  <tr key={b._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#0F172A] text-sm">{b.title}</p>
                      {b.excerpt && (
                        <p className="text-gray-400 text-xs truncate max-w-[280px]">{b.excerpt}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{b.author}</td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublish(b)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                          b.published
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        }`}
                      >
                        {b.published ? <><Eye size={12} /> Published</> : <><EyeOff size={12} /> Draft</>}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => openEdit(b)} className="text-[#0E7490] hover:text-[#0A5A70] transition">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => remove(b._id)} className="text-red-400 hover:text-red-600 transition">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-[#0F172A]">
                {editing ? "Edit Post" : "New Blog Post"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={22} />
              </button>
            </div>

            <div className="px-8 py-6 space-y-4">
              <Field label="Title *">
                <Input
                  required
                  placeholder="e.g. Why Indian Spices Are the Best in the World"
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm((f) => ({
                      ...f,
                      title,
                      slug: f.slug || autoSlug(title),
                      metaTitle: f.metaTitle || title,
                    }));
                  }}
                />
              </Field>

              <Field label="Slug">
                <Input
                  placeholder="why-indian-spices-are-best"
                  value={form.slug}
                  onChange={set("slug")}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Author">
                  <Input value={form.author} onChange={set("author")} />
                </Field>
                <Field label="Featured Image URL">
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://... or /images/blog.jpg"
                      value={form.image}
                      onChange={set("image")}
                    />
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#0E7490] px-3 py-2 text-xs font-semibold text-[#0E7490] hover:bg-[#0E7490]/5">
                      <Upload size={14} />
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) void uploadImage(file);
                        }}
                      />
                    </label>
                  </div>
                </Field>
              </div>

              <Field label="Excerpt (shown in listings)">
                <Textarea rows={2} value={form.excerpt} onChange={set("excerpt")} placeholder="A short summary..." />
              </Field>

              <Field label="Content (Markdown supported)">
                <Textarea rows={10} value={form.content} onChange={set("content")} placeholder="Write your blog post here..." />
              </Field>

              <Field label="Tags (comma separated)">
                <Input placeholder="spices, export, India" value={form.tags} onChange={set("tags")} />
              </Field>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold text-gray-500 mb-3">SEO</p>
                <div className="space-y-3">
                  <Field label="Meta Title">
                    <Input value={form.metaTitle} onChange={set("metaTitle")} />
                  </Field>
                  <Field label="Meta Description">
                    <Textarea rows={2} value={form.metaDescription} onChange={set("metaDescription")} />
                  </Field>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  checked={form.published}
                  onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                  className="w-4 h-4 accent-[#0E7490] rounded"
                />
                <label htmlFor="published" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Publish immediately
                </label>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving || !form.title}
                className="px-5 py-2.5 rounded-xl bg-[#0E7490] hover:bg-[#0A5A70] disabled:opacity-60 text-white text-sm font-semibold transition"
              >
                {saving ? "Saving…" : editing ? "Update Post" : "Create Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
