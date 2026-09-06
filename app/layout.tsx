import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = { title: "Tendr Lead Engine", description: "Founder lead acquisition dashboard" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4"><Link href="/dashboard" className="font-bold tracking-tight text-slate-950"><span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-sm text-white">T</span>Tendr <span className="font-medium text-slate-400">Lead Engine</span></Link><nav className="flex items-center gap-4 text-sm font-medium text-slate-600"><Link href="/dashboard">Dashboard</Link><Link href="/call-sheet">Call sheet</Link><Link href="/companies">Companies</Link><Link href="/contacts/import">Import contacts</Link></nav></div></header><main className="mx-auto w-full max-w-7xl px-5 py-8">{children}</main></body></html>;
}
