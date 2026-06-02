import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { events } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db.select().from(events).orderBy(desc(events.id));
    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/admin/events error:", error);
    return NextResponse.json(
      { error: "Gagal memuat data event." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const [inserted] = await db
      .insert(events)
      .values({
        title: body.title,
        description: body.description || null,
        eventType: body.eventType,
        deliveryMode: body.deliveryMode,
        eventDate: body.eventDate,
        startTime: body.startTime || null,
        endTime: body.endTime || null,
        quota: body.quota ?? 0,
        price: body.price?.toString() ?? "0",
        thumbnailUrl: body.thumbnailUrl || null,
        isPublished: body.isPublished ?? true,
      })
      .returning();

    return NextResponse.json({ data: inserted }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/events error:", error);
    const message =
      error instanceof Error ? error.message : "Gagal menambah event.";
    return NextResponse.json(
      { error: message },
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
      .update(events)
      .set({
        title: values.title,
        description: values.description || null,
        eventType: values.eventType,
        deliveryMode: values.deliveryMode,
        eventDate: values.eventDate,
        startTime: values.startTime || null,
        endTime: values.endTime || null,
        quota: values.quota ?? 0,
        price: values.price?.toString() ?? "0",
        thumbnailUrl: values.thumbnailUrl || null,
        isPublished: values.isPublished ?? true,
        updatedAt: new Date(),
      })
      .where(eq(events.id, id))
      .returning();

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("PUT /api/admin/events error:", error);
    return NextResponse.json(
      { error: "Gagal mengubah event." },
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

    await db.delete(events).where(eq(events.id, Number(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/events error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus event." },
      { status: 500 },
    );
  }
}
