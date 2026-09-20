import { NextRequest, NextResponse } from "next/server";
import { getViews, incrementViews } from "@/lib/redis";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing topic ID" }, { status: 400 });
  }

  const views = await getViews(id);
  return NextResponse.json({ id, views });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing topic ID" }, { status: 400 });
  }

  const views = await incrementViews(id);
  return NextResponse.json({ id, views });
}
