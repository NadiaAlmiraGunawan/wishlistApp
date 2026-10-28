import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { mapWishlistRow, validateWishlistInput } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";
    const priority = searchParams.get("priority")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const sort = searchParams.get("sort")?.trim() || "newest";

    const conditions: string[] = [];
    const params: any[] = [];

    if (search) {
      conditions.push("title LIKE ?");
      params.push(`%${search}%`);
    }
    if (category) {
      conditions.push("category = ?");
      params.push(category);
    }
    if (priority) {
      conditions.push("priority = ?");
      params.push(priority);
    }
    if (status) {
      conditions.push("status = ?");
      params.push(status);
    }

    let orderBy = "created_at DESC";
    if (sort === "oldest") orderBy = "created_at ASC";
    else if (sort === "priority") {
      orderBy =
        "FIELD(priority, 'tinggi', 'sedang', 'rendah') ASC, created_at DESC";
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const sql = `SELECT * FROM wishlist ${whereClause} ORDER BY ${orderBy}`;
    const rows = await query<any[]>(sql, params);

    return NextResponse.json({
      success: true,
      data: rows.map(mapWishlistRow),
    });
  } catch (error: any) {
    console.error("GET /api/routes error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data wishlist." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
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

    const insertResult: any = await query(
      `INSERT INTO wishlist 
        (title, description, category, target_price, priority, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, category, targetPrice, priority, status]
    );

    const rows = await query<any[]>(
      "SELECT * FROM wishlist WHERE id = ?",
      [insertResult.insertId]
    );

    return NextResponse.json(
      { success: true, data: mapWishlistRow(rows[0]) },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/routes error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menambahkan wishlist." },
      { status: 500 }
    );
  }
}