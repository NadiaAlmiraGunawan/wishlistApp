import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Priority, Status, Wishlist, WishlistInput } from "./types";

// 1. Fungsi cn bawaan Shadcn UI
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 2. Mapper Data
export function mapWishlistRow(row: any): Wishlist {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    targetPrice: row.target_price !== null ? Number(row.target_price) : null,
    priority: row.priority,
    status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

// 3. Formatter Rupiah
export function formatRupiah(v: number | null): string {
  if (v === null || v === undefined) return "-";
  return "Rp " + v.toLocaleString("id-ID");
}

// 4. Validasi
export const VALID_PRIORITIES: Priority[] = ["rendah", "sedang", "tinggi"];
export const VALID_STATUSES: Status[] = [
  "ingin_dimiliki",
  "sedang_ditabung",
  "sudah_tercapai",
];

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
  data?: WishlistInput;
}

export function validateWishlistInput(
  body: any,
  partial = false
): ValidationResult {
  const errors: Record<string, string> = {};

  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const description =
    typeof body?.description === "string" && body.description.trim() !== ""
      ? body.description.trim()
      : null;
  const category =
    typeof body?.category === "string" && body.category.trim() !== ""
      ? body.category.trim()
      : "Lainnya";

  let targetPrice: number | null = null;
  if (
    body?.targetPrice !== undefined &&
    body?.targetPrice !== null &&
    body?.targetPrice !== ""
  ) {
    const parsed = Number(body.targetPrice);
    if (isNaN(parsed) || parsed < 0) {
      errors.targetPrice = "Target biaya harus berupa angka positif.";
    } else {
      targetPrice = parsed;
    }
  }

  const priority = body?.priority as Priority;
  const status = body?.status as Status;

  if (!partial || body?.title !== undefined) {
    if (!title) errors.title = "Nama wishlist wajib diisi.";
    else if (title.length > 150)
      errors.title = "Nama wishlist maksimal 150 karakter.";
  }

  if (body?.category !== undefined && category.length > 50) {
    errors.category = "Kategori maksimal 50 karakter.";
  }

  if (!partial || body?.priority !== undefined) {
    if (!priority || !VALID_PRIORITIES.includes(priority)) {
      errors.priority = "Prioritas tidak valid.";
    }
  }

  if (!partial || body?.status !== undefined) {
    if (!status || !VALID_STATUSES.includes(status)) {
      errors.status = "Status tidak valid.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: {},
    data: {
      title,
      description,
      category,
      targetPrice,
      priority: priority ?? "sedang",
      status: status ?? "ingin_dimiliki",
    },
  };
}