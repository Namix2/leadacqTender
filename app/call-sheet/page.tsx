import { db } from "@/lib/db";
import { CallSheetRow } from "@/components/CallSheetRow";

export const dynamic = "force-dynamic";

export default async function CallSheetPage() { const contacts = await db.contact.findMany({ where: { verified: true, callStatus: "not_contacted" }, include: { company: true }, orderBy: [{ company: { priorityScore: "desc" } }, { roleTier: "asc" }] }); return <div><p className="eyebrow">Daily call sheet</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Research-led openings, ready to use.</h1><p className="mt-2 text-sm text-slate-600">Verified, uncontacted people ranked by the bid pain their company is showing.</p><div className="mt-7 space-y-4">{contacts.length ? contacts.map((contact) => <CallSheetRow key={contact.id} contact={contact} />) : <div className="card p-8 text-sm text-slate-600">No verified, uncontacted contacts yet. Import a CSV or add contacts to a company, then mark those ready to call as verified.</div>}</div></div>; }
