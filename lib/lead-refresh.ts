import { db } from "@/lib/db";
import { calculatePriorityScore, matchConfidence } from "@/lib/priority-score";

export async function refreshCompanyScores() {
  const [companies, awards] = await Promise.all([db.targetCompany.findMany(), db.awardNotice.findMany({ where: { awardDate: { gte: new Date(Date.now() - 365 * 86400000) } }, orderBy: { awardDate: "desc" } })]);
  let matched = 0;
  await Promise.all(companies.map(async (company) => {
    const companyAwards = awards.filter((award) => matchConfidence(company.companyName, award.supplierName) >= 0.82);
    if (!companyAwards.length) return;
    matched += companyAwards.length;
    const latest = companyAwards[0]; const won = companyAwards.length;
    const score = calculatePriorityScore({ bidCount12m: companyAwards.length, winCount12m: won, daysSinceLastBid: Math.max(0, Math.floor((Date.now() - latest.awardDate.getTime()) / 86400000)) });
    await db.targetCompany.update({ where: { id: company.id }, data: { bidCount12m: companyAwards.length, winCount12m: won, lastBidDate: latest.awardDate, lastBidBuyer: latest.buyerName, lastBidOutcome: "won", priorityScore: score } });
  }));
  return { companies: companies.length, matched };
}
