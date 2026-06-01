import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { partnerships } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db.select().from(partnerships).orderBy(desc(partnerships.id));
    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/admin/partnerships error:", error);
    return NextResponse.json(
      { error: "Gagal memuat data partnership." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: "Nama partner wajib diisi." },
        { status: 400 },
      );
    }

    if (!body.logoUrl?.trim()) {
      return NextResponse.json(
        { error: "URL Logo wajib diisi." },
        { status: 400 },
      );
    }

    const [inserted] = await db
      .insert(partnerships)
      .values({
        name: body.name.trim(),
        logoUrl: body.logoUrl.trim(),
      })
      .returning();

    return NextResponse.json({ data: inserted }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/partnerships error:", error);
    return NextResponse.json(
      { error: "Gagal menambah partnership." },
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

    if (!values.name?.trim()) {
      return NextResponse.json(
        { error: "Nama partner wajib diisi." },
        { status: 400 },
      );
    }

    if (!values.logoUrl?.trim()) {
      return NextResponse.json(
        { error: "URL Logo wajib diisi." },
        { status: 400 },
      );
    }

    const [updated] = await db
      .update(partnerships)
      .set({
        name: values.name.trim(),
        logoUrl: values.logoUrl.trim(),
        updatedAt: new Date(),
      })
      .where(eq(partnerships.id, id))
      .returning();

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("PUT /api/admin/partnerships error:", error);
    return NextResponse.json(
      { error: "Gagal mengubah partnership." },
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

    await db.delete(partnerships).where(eq(partnerships.id, Number(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/partnerships error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus partnership." },
      { status: 500 },
    );
  }
}
