"use client";

import { useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/types";
import type { Wishlist, WishlistInput, Priority } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Props {
  initial?: Wishlist | null;
  onSubmit: (
    data: WishlistInput
  ) => Promise<{ ok: boolean; errors?: Record<string, string> }>;
  onCancel: () => void;
}

const emptyForm: WishlistInput = {
  title: "",
  description: "",
  category: "Lainnya",
  targetPrice: null,
  priority: "sedang",
  status: "ingin_dimiliki",
};

export default function WishlistForm({ initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<WishlistInput>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title,
        description: initial.description ?? "",
        category: initial.category,
        targetPrice: initial.targetPrice,
        priority: initial.priority,
        status: initial.status,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [initial]);

  function update<K extends keyof WishlistInput>(
    key: K,
    value: WishlistInput[K]
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);
    const payload: WishlistInput = {
      ...form,
      targetPrice:
        form.targetPrice === null || (form.targetPrice as any) === ""
          ? null
          : Number(form.targetPrice),
    };
    const res = await onSubmit(payload);
    setSubmitting(false);
    if (!res.ok) {
      setErrors(res.errors ?? { title: "Terjadi kesalahan." });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <Label>Nama Wishlist *</Label>
        <Input
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="Contoh: Laptop untuk kuliah"
          className="mt-1"
        />
        {errors.title && (
          <p className="text-xs text-red-500 mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <Label>Deskripsi</Label>
        <Textarea
          value={form.description ?? ""}
          onChange={(e) => update("description", e.target.value)}
          rows={3}
          placeholder="Alasan atau catatan tambahan..."
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Kategori</Label>
          <select
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            className="mt-1 flex h-8 w-full rounded-none border border-input bg-transparent px-2.5 py-1 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Target Biaya</Label>
          <Input
            type="number"
            min={0}
            value={form.targetPrice ?? ""}
            onChange={(e) =>
              update(
                "targetPrice",
                e.target.value === "" ? null : Number(e.target.value)
              )
            }
            placeholder="Opsional"
            className="mt-1"
          />
          {errors.targetPrice && (
            <p className="text-xs text-red-500 mt-1">{errors.targetPrice}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Prioritas</Label>
          <select
            value={form.priority}
            onChange={(e) => update("priority", e.target.value as Priority)}
            className="mt-1 flex h-8 w-full rounded-none border border-input bg-transparent px-2.5 py-1 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
          >
            <option value="rendah">Rendah</option>
            <option value="sedang">Sedang</option>
            <option value="tinggi">Tinggi</option>
          </select>
        </div>
        <div>
          <Label>Status</Label>
          <select
            value={form.status}
            onChange={(e) => update("status", e.target.value as any)}
            className="mt-1 flex h-8 w-full rounded-none border border-input bg-transparent px-2.5 py-1 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
          >
            <option value="ingin_dimiliki">Ingin Dimiliki</option>
            <option value="sedang_ditabung">Sedang Ditabung</option>
            <option value="sudah_tercapai">Sudah Tercapai</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Menyimpan..." : initial ? "Simpan Perubahan" : "Tambah"}
        </Button>
      </div>
    </form>
  );
}