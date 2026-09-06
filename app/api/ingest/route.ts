import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { fetchRecentAwards } from "@/lib/ocds-client";
import { refreshCompanyScores } from "@/lib/lead-refresh";

export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!process.env.INGEST_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.INGEST_SECRET}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { awards, errors } = await fetchRecentAwards(); let saved = 0;
  for (const award of awards) { try { await db.awardNotice.upsert({ where: { rawNoticeId: award.rawNoticeId }, update: { buyerName: award.buyerName, supplierName: award.supplierName, cpvCode: award.cpvCode, value: award.value, awardDate: award.awardDate }, create: { ...award, sourceSystem: award.rawNoticeId.split(":")[0] } }); saved++; } catch (error) { errors.push(error instanceof Error ? error.message : "Could not save award"); } }
  const match = await refreshCompanyScores();
  console.info("Ingestion completed", { received: awards.length, saved, errors: errors.length, match });
  return NextResponse.json({ received: awards.length, saved, errors, match });
}
