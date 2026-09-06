import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() { return NextResponse.json(await db.targetCompany.findMany({ orderBy: { priorityScore: "desc" } })); }
export async function POST(request: Request) {
  const body = await request.json();
  if (!body.companyName?.trim()) return NextResponse.json({ error: "Company name is required" }, { status: 400 });
  const company = await db.targetCompany.create({ data: { companyName: body.companyName.trim(), companiesHouseNumber: body.companiesHouseNumber || null, turnoverBand: body.turnoverBand || null, sicCode: body.sicCode || null, notes: body.notes || null } });
  return NextResponse.json(company, { status: 201 });
}
