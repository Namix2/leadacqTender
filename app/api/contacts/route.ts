import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.companyId || !body.fullName || !body.roleTitle) return NextResponse.json({ error: "Company, name and role are required" }, { status: 400 });
  const contact = await db.contact.create({ data: { companyId: body.companyId, fullName: body.fullName, roleTitle: body.roleTitle, roleTier: body.roleTier || "secondary", linkedinUrl: body.linkedinUrl || null, email: body.email || null, phone: body.phone || null, source: body.source || "manual", verified: Boolean(body.verified) } });
  return NextResponse.json(contact, { status: 201 });
}
