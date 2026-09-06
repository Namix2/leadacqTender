export type ParsedContact = { fullName: string; roleTitle: string; email?: string; phone?: string; linkedinUrl?: string; source: string };

function csvRows(text: string) {
  const rows: string[][] = []; let row: string[] = []; let cell = ""; let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"' && text[i + 1] === '"') { cell += '"'; i++; }
    else if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { row.push(cell.trim()); cell = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) { if (char === "\r" && text[i + 1] === "\n") i++; row.push(cell.trim()); if (row.some(Boolean)) rows.push(row); row = []; cell = ""; }
    else cell += char;
  }
  if (cell || row.length) { row.push(cell.trim()); rows.push(row); }
  return rows;
}

const get = (row: Record<string, string>, names: string[]) => names.map((n) => row[n]).find(Boolean)?.trim();

export function parseContactsCsv(text: string): ParsedContact[] {
  const rows = csvRows(text); if (rows.length < 2) return [];
  const headers = rows[0].map((h) => h.toLowerCase().replace(/[^a-z]/g, ""));
  return rows.slice(1).map((values) => {
    const row = Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
    const first = get(row, ["firstname", "first"]); const last = get(row, ["lastname", "last"]);
    const fullName = get(row, ["fullname", "name", "contactname"]) || [first, last].filter(Boolean).join(" ");
    return { fullName, roleTitle: get(row, ["jobtitle", "title", "position", "role"]) || "Unknown role", email: get(row, ["email", "emailaddress", "workemail"]), phone: get(row, ["phone", "phonenumber", "mobile", "directphone"]), linkedinUrl: get(row, ["linkedinurl", "linkedin", "linkedinprofile"]), source: headers.some((h) => h.includes("lusha")) ? "lusha" : "linkedin" };
  }).filter((contact) => contact.fullName);
}
