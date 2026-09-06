import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const statusForOutcome: Record<string, string> = { no_answer: "called", voicemail: "called", spoke: "called", callback_requested: "callback", hot: "hot", dead: "dead", intent_signed: "intent_signed" };
export async function POST(request: Request) {
  const { contactId, outcome, notes, callStatus } = await request.json();
  if (!contactId || !outcome) return NextResponse.json({ error: "Contact and outcome are required" }, { status: 400 });
  const contact = await db.contact.update({ where: { id: contactId }, data: { callStatus: callStatus || statusForOutcome[outcome] || "called", lastContactedAt: new Date(), callLogs: { create: { outcome, notes: notes || null } } } });
  return NextResponse.json(contact);
}
