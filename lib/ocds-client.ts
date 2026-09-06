export type AwardRecord = { rawNoticeId: string; buyerName: string; supplierName: string; cpvCode: string; value?: number; awardDate: Date };

type UnknownRecord = Record<string, unknown>;
const object = (value: unknown): UnknownRecord => value && typeof value === "object" ? value as UnknownRecord : {};
const list = (value: unknown): unknown[] => Array.isArray(value) ? value : [];

function fromRelease(release: UnknownRecord, source: string, cpvPrefixes: string[]): AwardRecord[] {
  const tender = object(release.tender);
  const classifications = [object(tender.classification), ...list(tender.additionalClassifications).map(object)];
  const cpv = classifications.map((x) => String(x.id || "")).find((code) => cpvPrefixes.some((prefix) => code.startsWith(prefix.slice(0, 2)))) || "";
  if (!cpv) return [];
  const buyer = object(release.buyer).name || object(release.parties).name || "Unknown buyer";
  const awards = list(release.awards);
  return awards.flatMap((award, awardIndex) => {
    const item = object(award); const suppliers = list(item.suppliers);
    return suppliers.map((supplier, supplierIndex) => {
      const supplierInfo = object(supplier); const value = object(item.value);
      return { rawNoticeId: `${source}:${String(release.id || release.ocid || "release")}:${String(item.id || awardIndex)}:${supplierIndex}`, buyerName: String(buyer), supplierName: String(supplierInfo.name || "Unknown supplier"), cpvCode: cpv, value: typeof value.amount === "number" ? value.amount : undefined, awardDate: new Date(String(item.date || item.datePublished || release.date || Date.now())) };
    });
  });
}

function releases(payload: unknown) {
  const root = object(payload);
  const direct = list(root.releases);
  if (direct.length) return direct.map(object);
  return list(root.records).flatMap((record) => list(object(record).releases).map(object));
}

async function getJson(url: string) {
  const response = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" });
  if (!response.ok) throw new Error(`${response.status} from ${url}`);
  return response.json();
}

export async function fetchRecentAwards() {
  const cpvPrefixes = (process.env.TARGET_CPV_CODES || "45000000,45200000,50700000,71000000").split(",").map((code) => code.trim()).filter(Boolean);
  const since = new Date(Date.now() - 14 * 86400000).toISOString().slice(0, 19);
  const now = new Date().toISOString().slice(0, 19);
  const ftsBase = process.env.FIND_A_TENDER_API_BASE || "https://www.find-tender.service.gov.uk/api/1.0";
  const cfBase = process.env.CONTRACTS_FINDER_API_BASE || "https://www.contractsfinder.service.gov.uk/Published/Notices/OCDS";
  const urls = [
    `${ftsBase}/ocdsReleasePackages?stages=award&updatedFrom=${encodeURIComponent(since)}&updatedTo=${encodeURIComponent(now)}&limit=100`,
    `${cfBase}/Search?publishedFrom=${encodeURIComponent(since)}&publishedTo=${encodeURIComponent(now)}&stages=award&limit=100`,
  ];
  const results = await Promise.allSettled(urls.map(getJson));
  const errors: string[] = []; const awards: AwardRecord[] = [];
  results.forEach((result, index) => {
    if (result.status === "rejected") errors.push(index === 0 ? `Find a Tender: ${result.reason}` : `Contracts Finder: ${result.reason}`);
    else awards.push(...releases(result.value).flatMap((release) => fromRelease(release, index === 0 ? "find_a_tender" : "contracts_finder", cpvPrefixes)));
  });
  return { awards, errors };
}
