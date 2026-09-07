import { db } from "@/lib/db";
import { ImportDropzone } from "@/components/ImportDropzone";

export const dynamic = "force-dynamic";

export default async function ImportPage() { const companies = await db.targetCompany.findMany({ select: { id: true, companyName: true }, orderBy: { companyName: "asc" } }); return <div><p className="eyebrow">Manual enrichment</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Import contacts, with a review step.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Upload a Lusha or LinkedIn CSV and assign it to a single target company. Nothing is added until you confirm the mapped rows.</p><div className="mt-7 max-w-4xl"><ImportDropzone companies={companies} /></div></div>; }
