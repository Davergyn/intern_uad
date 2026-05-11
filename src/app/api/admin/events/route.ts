import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/utils/supabase/admin";
import type { EventFormValues } from "@/types/database";

function normalizeEventPayload(values: EventFormValues) {
  return {
    title: values.title.trim(),
    description: values.description?.trim() || null,
    type: values.type,
    delivery: values.delivery,
    event_date: values.event_date,
    start_time: values.start_time || null,
    end_time: values.end_time || null,
    quota: Number(values.quota || 0),
    price: Number(values.price || 0),
    thumbnail_url: values.thumbnail_url?.trim() || null,
    is_published: values.is_published,
  };
}

export async function GET() {
  const { data, error } = await createAdminSupabaseClient()
    .from("events")
    .select("*")
    .order("event_date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [] });
}

export async function POST(request: Request) {
  const body = (await request.json()) as EventFormValues;
  const { data, error } = await createAdminSupabaseClient()
    .from("events")
    .insert(normalizeEventPayload(body))
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 201 });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as EventFormValues & { id?: number };

  if (!body.id) {
    return NextResponse.json({ error: "Event id is required." }, { status: 400 });
  }

  const { data, error } = await createAdminSupabaseClient()
    .from("events")
    .update(normalizeEventPayload(body))
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

export async function DELETE(request: Request) {
  const id = Number(new URL(request.url).searchParams.get("id"));

  if (!id) {
    return NextResponse.json({ error: "Event id is required." }, { status: 400 });
  }

  const { error } = await createAdminSupabaseClient().from("events").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data: { id } });
}
