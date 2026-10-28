import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { mapWishlistRow, validateWishlistInput } from "@/lib/utils";

export const dynamic = "force-dynamic";

function parseId(idStr: string): number | null {
  const id = Number(idStr);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // <-- 1. Ubah tipe data params jadi Promise
) {
  try {
    // 2. Await params sebelum mengambil id
    const resolvedParams = await params;
    const id = parseId(resolvedParams.id);

    if (id === null) {
      return NextResponse.json(
        { success: false, message: "ID tidak valid." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const result = validateWishlistInput(body);

    if (!result.valid || !result.data) {
      return NextResponse.json(
        { success: false, message: "Data tidak valid.", errors: result.errors },
        { status: 400 }
      );
    }

    const { title, description, category, targetPrice, priority, status } =
      result.data;

    const updateResult: any = await query(
      `UPDATE wishlist SET
        title = ?, description = ?, category = ?,
        target_price = ?, priority = ?, status = ?
       WHERE id = ?`,
      [title, description, category, targetPrice, priority, status, id]
    );

    if (updateResult.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Wishlist tidak ditemukan atau tidak ada perubahan." },
        { status: 404 }
      );
    }

    const rows = await query<any[]>(
      "SELECT * FROM wishlist WHERE id = ?",
      [id]
    );

    return NextResponse.json({ success: true, data: mapWishlistRow(rows[0]) });
  } catch (error: any) {
    console.error("PUT /api/routes/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui wishlist." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // <-- Ubah juga di sini
) {
  try {
    // 3. Await params di fungsi DELETE
    const resolvedParams = await params;
    const id = parseId(resolvedParams.id);

    if (id === null) {
      return NextResponse.json(
        { success: false, message: "ID tidak valid." },
        { status: 400 }
      );
    }

    const result: any = await query("DELETE FROM wishlist WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Wishlist tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Wishlist dihapus." });
  } catch (error: any) {
    console.error("DELETE /api/routes/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus wishlist." },
      { status: 500 }
    );
  }
}