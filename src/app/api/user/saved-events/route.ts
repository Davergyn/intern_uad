import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { userSavedEvents, users, events } from "@/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * GET /api/user/saved-events?email=user@email.com
 * Retrieve all saved events for a user
 */
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 },
      );
    }

    // Find user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all saved events for this user with event details
    const savedEvents = await db
      .select({
        id: userSavedEvents.id,
        eventId: userSavedEvents.eventId,
        savedAt: userSavedEvents.savedAt,
        event: {
          id: events.id,
          title: events.title,
          description: events.description,
          eventType: events.eventType,
          deliveryMode: events.deliveryMode,
          eventDate: events.eventDate,
          startTime: events.startTime,
          endTime: events.endTime,
          quota: events.quota,
          price: events.price,
          thumbnailUrl: events.thumbnailUrl,
        },
      })
      .from(userSavedEvents)
      .innerJoin(events, eq(userSavedEvents.eventId, events.id))
      .where(eq(userSavedEvents.userId, user.id));

    return NextResponse.json({
      success: true,
      data: savedEvents,
      count: savedEvents.length,
    });
  } catch (error) {
    console.error("Error fetching saved events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/user/saved-events
 * Save an event for a user
 * Body: { email: string, eventId: number }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, eventId } = body;

    if (!email || !eventId) {
      return NextResponse.json(
        { error: "Email and eventId are required" },
        { status: 400 },
      );
    }

    // Find user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if event exists
    const event = await db.query.events.findFirst({
      where: eq(events.id, eventId),
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check if already saved (avoid duplicate)
    const existing = await db.query.userSavedEvents.findFirst({
      where: and(
        eq(userSavedEvents.userId, user.id),
        eq(userSavedEvents.eventId, eventId),
      ),
    });

    if (existing) {
      return NextResponse.json(
        { error: "Event already saved" },
        { status: 409 },
      );
    }

    // Insert saved event
    const result = await db
      .insert(userSavedEvents)
      .values({
        userId: user.id,
        eventId,
      })
      .returning();

    return NextResponse.json(
      { success: true, data: result[0] },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error saving event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/user/saved-events
 * Remove a saved event for a user
 * Body: { email: string, eventId: number }
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, eventId } = body;

    if (!email || !eventId) {
      return NextResponse.json(
        { error: "Email and eventId are required" },
        { status: 400 },
      );
    }

    // Find user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete saved event
    const result = await db
      .delete(userSavedEvents)
      .where(
        and(
          eq(userSavedEvents.userId, user.id),
          eq(userSavedEvents.eventId, eventId),
        ),
      )
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Saved event not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Event removed from saved",
    });
  } catch (error) {
    console.error("Error removing saved event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
