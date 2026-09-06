import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const { contactId, estimatedValue, notes, confirmed } = await request.json(); const value = Number(estimatedValue);
  if (!contactId || !Number.isFinite(value) || value <= 0) return NextResponse.json({ error: "A contact and a positive annual value are required" }, { status: 400 });
  const intent = await db.expressionOfIntent.upsert({ where: { contactId }, update: { estimatedValue: value, notes: notes || null, confirmedAt: confirmed ? new Date() : null }, create: { contactId, estimatedValue: value, notes: notes || null, confirmedAt: confirmed ? new Date() : null } });
  if (confirmed) await db.contact.update({ where: { id: contactId }, data: { callStatus: "intent_signed" } });
  return NextResponse.json(intent);
}
