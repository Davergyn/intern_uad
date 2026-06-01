import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { materials } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db.select().from(materials).orderBy(desc(materials.id));
    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/admin/materi error:", error);
    return NextResponse.json(
      { error: "Gagal memuat data materi." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const [inserted] = await db
      .insert(materials)
      .values({
        title: body.title,
        description: body.description || null,
        linkUrl: body.linkUrl || null,
        coverUrl: body.coverUrl || null,
        isActive: body.isActive ?? true,
      })
      .returning();

    return NextResponse.json({ data: inserted }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/materi error:", error);
    return NextResponse.json(
      { error: "Gagal menambah materi." },
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
      .update(materials)
      .set({
        title: values.title,
        description: values.description || null,
        linkUrl: values.linkUrl || null,
        coverUrl: values.coverUrl || null,
        isActive: values.isActive ?? true,
        updatedAt: new Date(),
      })
      .where(eq(materials.id, id))
      .returning();

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("PUT /api/admin/materi error:", error);
    return NextResponse.json(
      { error: "Gagal mengubah materi." },
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

    await db.delete(materials).where(eq(materials.id, Number(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/materi error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus materi." },
      { status: 500 },
    );
  }
}
