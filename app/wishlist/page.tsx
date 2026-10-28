"use client";

import { useMemo, useState } from "react";
import { useWishlist, type FilterState } from "@/hooks/useWishlist";
import type { Wishlist, WishlistInput } from "@/lib/types";
import { CATEGORIES, PRIORITY_LABELS, STATUS_LABELS } from "@/lib/types";
import { formatRupiah } from "@/lib/utils";
import WishlistForm from "@/components/wishlist.form"; 
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Search, ListTodo, CheckCircle2, Clock, Star } from "lucide-react";

export default function WishlistPage() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "",
    priority: "",
    status: "",
    sort: "newest",
  });

  const { data, loading, error, refetch } = useWishlist(filters);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Wishlist | null>(null);
  const [deleting, setDeleting] = useState<Wishlist | null>(null);

  // Statistik
  const stats = useMemo(() => {
    return {
      total: data.length,
      tercapai: data.filter((d) => d.status === "sudah_tercapai").length,
      belumTercapai: data.filter((d) => d.status !== "sudah_tercapai").length,
      prioritasTinggi: data.filter((d) => d.priority === "tinggi").length,
    };
  }, [data]);

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };
  
  const openEdit = (w: Wishlist) => {
    setEditing(w);
    setShowForm(true);
  };

  async function handleSubmit(input: WishlistInput) {
    try {
      const url = editing ? `/api/routes/${editing.id}` : "/api/routes";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.message || "Gagal menyimpan.");
        return { ok: false, errors: json.errors ?? {} };
      }
      toast.success(editing ? "Wishlist diperbarui." : "Wishlist ditambahkan.");
      setShowForm(false);
      setEditing(null);
      refetch();
      return { ok: true };
    } catch {
      toast.error("Terjadi kesalahan jaringan.");
      return { ok: false };
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    try {
      const res = await fetch(`/api/routes/${deleting.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.message || "Gagal menghapus.");
      } else {
        toast.success("Wishlist dihapus.");
        refetch();
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setDeleting(null);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sudah_tercapai":
        return "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
      case "sedang_ditabung":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200";
      case "ingin_dimiliki":
        return "bg-red-100 text-red-700 hover:bg-red-200 border-red-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="w-full min-h-screen px-6 md:px-10 py-8 bg-sky-50">
      
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Wishlist Saya</h1>
          <p className="text-muted-foreground mt-3 text-lg">
            {stats.total} wishlist tercatat
          </p>
        </div>
        <Button onClick={openCreate} className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-4 py-6 text-base">
          + Tambah Wishlist
        </Button>
      </header>

      {/* 4 Kartu Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 flex flex-col items-center justify-center text-center bg-white shadow-sm rounded-2xl border-none ring-1 ring-border/50">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl mb-4">
            <ListTodo size={28} />
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Total Wishlist</p>
          <h3 className="text-4xl font-bold text-foreground">{stats.total}</h3>
        </Card>
        
        <Card className="p-6 flex flex-col items-center justify-center text-center bg-white shadow-sm rounded-2xl border-none ring-1 ring-border/50">
          <div className="p-3 bg-teal-100 text-teal-600 rounded-xl mb-4">
            <CheckCircle2 size={28} />
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Sudah Tercapai</p>
          <h3 className="text-4xl font-bold text-foreground">{stats.tercapai}</h3>
        </Card>

        <Card className="p-6 flex flex-col items-center justify-center text-center bg-white shadow-sm rounded-2xl border-none ring-1 ring-border/50">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-xl mb-4">
            <Clock size={28} />
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Belum Tercapai</p>
          <h3 className="text-4xl font-bold text-foreground">{stats.belumTercapai}</h3>
        </Card>

        <Card className="p-6 flex flex-col items-center justify-center text-center bg-white shadow-sm rounded-2xl border-none ring-1 ring-border/50">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-xl mb-4">
            <Star size={28} />
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Prioritas Tinggi</p>
          <h3 className="text-4xl font-bold text-foreground">{stats.prioritasTinggi}</h3>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 bg-white shadow-sm rounded-2xl border-none ring-1 ring-border/50">
        <div className="relative col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Cari nama wishlist..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="pl-9 rounded-xl bg-muted/30 border-none focus-visible:ring-primary/20 h-10"
          />
        </div>
        
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="flex h-10 w-full rounded-xl bg-muted/30 border-none px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/20 text-muted-foreground"
        >
          <option value="">Semua Kategori</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          className="flex h-10 w-full rounded-xl bg-muted/30 border-none px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/20 text-muted-foreground"
        >
          <option value="">Semua Prioritas</option>
          <option value="rendah">Rendah</option>
          <option value="sedang">Sedang</option>
          <option value="tinggi">Tinggi</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="flex h-10 w-full rounded-xl bg-muted/30 border-none px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/20 text-muted-foreground"
        >
          <option value="">Semua Status</option>
          <option value="ingin_dimiliki">Ingin Dimiliki</option>
          <option value="sedang_ditabung">Sedang Ditabung</option>
          <option value="sudah_tercapai">Sudah Tercapai</option>
        </select>

        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value as any })}
          className="flex h-10 w-full rounded-xl bg-muted/30 border-none px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/20 text-muted-foreground"
        >
          <option value="newest">Terbaru</option>
          <option value="oldest">Terlama</option>
          <option value="priority">Prioritas</option>
        </select>
      </Card>

      {/* States */}
      {loading && <p className="text-center text-muted-foreground py-10">Memuat data...</p>}
      {error && <p className="text-center text-red-500 py-10">{error}</p>}

      {!loading && !error && data.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-border/60">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="text-muted-foreground" size={24} />
          </div>
          <h3 className="text-lg font-medium text-foreground">Belum ada wishlist</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Coba ubah filter pencarian atau tambahkan wishlist baru.
          </p>
        </div>
      )}

      {/* Grid Kartu Wishlist */}
      {!loading && !error && data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map((w) => (
            <Card key={w.id} className="flex flex-col justify-between overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow rounded-2xl border-none ring-1 ring-border/50">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4 gap-2">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-xl text-foreground leading-tight">{w.title}</h3>
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{w.category}</span>
                  </div>
                  
                  {/* Badge Prioritas (Warna Solid & Teks Putih) */}
                  <Badge 
                    className={`rounded-md font-semibold text-sm shrink-0 text-white border-none ${
                      w.priority === "tinggi" 
                        ? "bg-red-500 hover:bg-red-600" 
                        : w.priority === "sedang" 
                        ? "bg-blue-500 hover:bg-blue-600" 
                        : "bg-slate-500 hover:bg-slate-600"
                    }`}
                  >
                    {PRIORITY_LABELS[w.priority]}
                  </Badge>
                </div>
                
                {w.description && (
                  <p className="text-base text-muted-foreground line-clamp-2 mb-4">
                    {w.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={`rounded-md font-medium text-sm px-2.5 py-1 border ${getStatusColor(w.status)}`}>
                    {STATUS_LABELS[w.status]}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between px-6 py-4 bg-muted/10 border-t border-border/30">
                <span className="text-base font-bold text-foreground">
                  {formatRupiah(w.targetPrice)}
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="h-9 px-3 text-base rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900" onClick={() => openEdit(w)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" className="h-9 px-3 text-base rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => setDeleting(w)}>
                    Hapus
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Wishlist" : "Tambah Wishlist"}
            </DialogTitle>
          </DialogHeader>
          <WishlistForm
            initial={editing}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog Konfirmasi Hapus */}
      <Dialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>Hapus Wishlist?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Yakin ingin menghapus <strong>{deleting?.title}</strong>? Tindakan ini
            tidak bisa dibatalkan.
          </p>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setDeleting(null)} className="rounded-xl">
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDelete} className="rounded-xl">
              Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}