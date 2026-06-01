import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { programs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db.select().from(programs).orderBy(desc(programs.id));
    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/admin/programs error:", error);
    return NextResponse.json(
      { error: "Gagal memuat data program." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const [inserted] = await db
      .insert(programs)
      .values({
        kategori: body.kategori,
        title: body.title,
        imageUrl: body.imageUrl,
        description: body.description || null,
        isActive: body.isActive ?? true,
      })
      .returning();

    return NextResponse.json({ data: inserted }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/programs error:", error);
    return NextResponse.json(
      { error: "Gagal menambah program." },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...values } = body;

    if (!id) {
      return NextResponse.json({ error: "ID wajib diisi." }, { status: 400 });
    }

    const [updated] = await db
      .update(programs)
      .set({
        kategori: values.kategori,
        title: values.title,
        imageUrl: values.imageUrl,
        description: values.description || null,
        isActive: values.isActive ?? true,
        updatedAt: new Date(),
      })
      .where(eq(programs.id, id))
      .returning();

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("PUT /api/admin/programs error:", error);
    return NextResponse.json(
      { error: "Gagal mengubah program." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID wajib diisi." }, { status: 400 });
    }

    await db.delete(programs).where(eq(programs.id, Number(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/programs error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus program." },
      { status: 500 },
    );
  }
}
