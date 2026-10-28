"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Wishlist } from "@/lib/types";
import { formatRupiah } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ListTodo, CheckCircle2, Clock, Star } from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/routes", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setData(j.data);
      })
      .finally(() => setLoading(false));
  }, []);

  // Hitung statistik
  const total = data.length;
  const ongoing = data.filter((d) => d.status !== "sudah_tercapai").length;
  const done = data.filter((d) => d.status === "sudah_tercapai").length;
  const prioritasTinggi = data.filter((d) => d.priority === "tinggi").length;
  
  const latest = [...data]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 5);

  // Fungsi bantuan untuk warna Badge Status
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
    // Container utama (biru sangat muda)
    <div className="w-full min-h-screen px-6 md:px-10 py-8 bg-sky-50">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-3 text-lg">
          Yuk, wujudkan wishlist impianmu!!
        </p>
      </header>

      {loading ? (
        <p className="text-muted-foreground py-10">Memuat data...</p>
      ) : (
        <>
          {/* 4 Kartu Statistik (Diubah ke Tengah / Center) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <Card className="p-6 flex flex-col items-center justify-center text-center bg-white shadow-sm rounded-2xl border-none ring-1 ring-border/50">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl mb-4">
                <ListTodo size={28} />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Wishlist</p>
              <h3 className="text-4xl font-bold text-foreground">{total}</h3>
            </Card>
            
            <Card className="p-6 flex flex-col items-center justify-center text-center bg-white shadow-sm rounded-2xl border-none ring-1 ring-border/50">
              <div className="p-3 bg-teal-100 text-teal-600 rounded-xl mb-4">
                <CheckCircle2 size={28} />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Sudah Tercapai</p>
              <h3 className="text-4xl font-bold text-foreground">{done}</h3>
            </Card>

            <Card className="p-6 flex flex-col items-center justify-center text-center bg-white shadow-sm rounded-2xl border-none ring-1 ring-border/50">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-xl mb-4">
                <Clock size={28} />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Belum Tercapai</p>
              <h3 className="text-4xl font-bold text-foreground">{ongoing}</h3>
            </Card>

            <Card className="p-6 flex flex-col items-center justify-center text-center bg-white shadow-sm rounded-2xl border-none ring-1 ring-border/50">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-xl mb-4">
                <Star size={28} />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Prioritas Tinggi</p>
              <h3 className="text-4xl font-bold text-foreground">{prioritasTinggi}</h3>
            </Card>
          </div>

          {/* Section Wishlist Terbaru */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">
                Wishlist Terbaru
              </h2>
              <Link href="/wishlist">
                {/* Tombol Lihat semua dengan Hover yang jelas */}
                <Button 
                  variant="outline" 
                  className="rounded-full text-sm font-semibold border-slate-200 text-slate-800 bg-white hover:bg-slate-700 transition-all duration-200 shadow-sm"
                  >
                  Lihat semua
                  </Button> 
              </Link>
            </div>

            {latest.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-border/60">
                <p className="text-muted-foreground">
                  Belum ada wishlist. Yuk mulai tambah!
                </p>
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {latest.map((w) => (
                  <li key={w.id}>
                    <Card className="flex flex-row items-center justify-between p-5 bg-white shadow-sm hover:shadow-md transition-shadow rounded-2xl border-none ring-1 ring-border/50">
                      <div>
                        <p className="font-semibold text-lg text-foreground">{w.title}</p>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">{w.category}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-base font-semibold text-foreground">
                          {formatRupiah(w.targetPrice)}
                        </span>
                        {/* Badge dengan warna dinamis */}
                        <Badge 
                          className={`rounded-md font-medium text-sm px-3 py-1 border ${getStatusColor(w.status)}`}
                        >
                          {w.status.replace(/_/g, " ")}
                        </Badge>
                      </div>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}