import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { trainers } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db.select().from(trainers).orderBy(desc(trainers.id));
    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/admin/trainers error:", error);
    return NextResponse.json(
      { error: "Gagal memuat data trainer." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const [inserted] = await db
      .insert(trainers)
      .values({
        name: body.name,
        roleTitle: body.roleTitle || null,
        photoUrl: body.photoUrl || null,
        isActive: body.isActive ?? true,
      })
      .returning();

    return NextResponse.json({ data: inserted }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/trainers error:", error);
    return NextResponse.json(
      { error: "Gagal menambah trainer." },
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
      .update(trainers)
      .set({
        name: values.name,
        roleTitle: values.roleTitle || null,
        photoUrl: values.photoUrl || null,
        isActive: values.isActive ?? true,
        updatedAt: new Date(),
      })
      .where(eq(trainers.id, id))
      .returning();

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("PUT /api/admin/trainers error:", error);
    return NextResponse.json(
      { error: "Gagal mengubah trainer." },
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

    await db.delete(trainers).where(eq(trainers.id, Number(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/trainers error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus trainer." },
      { status: 500 },
    );
  }
}
