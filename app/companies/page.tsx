import Link from "next/link";
import { db } from "@/lib/db";
import { CompanyForm } from "@/components/CompanyForm";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() { const companies = await db.targetCompany.findMany({ include: { _count: { select: { contacts: true } } }, orderBy: { priorityScore: "desc" } }); return <div><p className="eyebrow">Target account list</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Companies ranked by opportunity.</h1><div className="mt-6 max-w-xl"><CompanyForm /></div><div className="mt-6 grid gap-3">{companies.length ? companies.map((company) => <Link key={company.id} href={`/companies/${company.id}`} className="card flex items-center justify-between p-5 transition hover:border-emerald-300"><div><h2 className="font-semibold">{company.companyName}</h2><p className="mt-1 text-sm text-slate-600">{company._count.contacts} contacts · {company.bidCount12m} awards matched in 12 months · {company.lastBidBuyer || "No latest buyer"}</p></div><div className="text-right"><p className="text-lg font-bold text-emerald-700">{Number(company.priorityScore || 0).toFixed(1)}</p><p className="text-xs text-slate-500">priority score</p></div></Link>) : <div className="card p-8 text-sm text-slate-600">Start by adding one or more companies you’d like to target.</div>}</div></div>; }
