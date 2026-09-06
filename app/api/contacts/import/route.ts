import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseContactsCsv } from "@/lib/csv-parser";

export async function POST(request: Request) {
  const form = await request.formData(); const companyId = String(form.get("companyId") || ""); const action = String(form.get("action") || "preview"); const file = form.get("file");
  if (!companyId || !(file instanceof File)) return NextResponse.json({ error: "Choose a company and CSV file" }, { status: 400 });
  const contacts = parseContactsCsv(await file.text());
  if (action === "preview") return NextResponse.json({ contacts });
  const selected = JSON.parse(String(form.get("contacts") || "[]"));
  if (!Array.isArray(selected)) return NextResponse.json({ error: "Invalid contact preview" }, { status: 400 });
  const created = await db.contact.createMany({ data: selected.map((contact) => ({ companyId, fullName: String(contact.fullName), roleTitle: String(contact.roleTitle || "Unknown role"), roleTier: String(contact.roleTier || "secondary"), linkedinUrl: contact.linkedinUrl || null, email: contact.email || null, phone: contact.phone || null, source: contact.source === "lusha" ? "lusha" : "linkedin", verified: Boolean(contact.verified) })) });
  return NextResponse.json({ imported: created.count });
}
