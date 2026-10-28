export type Priority = "rendah" | "sedang" | "tinggi";
export type Status = "ingin_dimiliki" | "sedang_ditabung" | "sudah_tercapai";

export interface Wishlist {
  id: number;
  title: string;
  description: string | null;
  category: string;
  targetPrice: number | null;
  priority: Priority;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistInput {
  title: string;
  description?: string | null;
  category: string;
  targetPrice?: number | null;
  priority: Priority;
  status: Status;
}

export const CATEGORIES = [
  "Elektronik",
  "Fashion",
  "pendidikan",
  "Kendaraan",
  "Perjalanan",
  "Hobi",
  "Lainnya",
] as const;

export const PRIORITY_LABELS: Record<Priority, string> = {
  rendah: "Rendah",
  sedang: "Sedang",
  tinggi: "Tinggi",
};

export const STATUS_LABELS: Record<Status, string> = {
  ingin_dimiliki: "Ingin Dimiliki",
  sedang_ditabung: "Sedang Ditabung",
  sudah_tercapai: "Sudah Tercapai",
};