# Tendr Lead Engine

Single-user founder dashboard for turning UK public-procurement award data into a research-backed cold-call list.

## Local setup

1. Copy the documented values in `.env.example` into `.env` and set a real Postgres `DATABASE_URL`.
2. Install dependencies: `npm install`.
3. Generate and apply the schema: `npm run db:generate` then `npm run db:migrate`.
4. Start the app: `npm run dev`.

Sign in using `APP_PASSWORD`. Add target companies, import contact CSVs or add contacts manually, then use **Refresh procurement data** to retrieve the last 14 days of award releases from Find a Tender and Contracts Finder.

## Railway deployment

1. Create a Railway project with a Postgres plugin and deploy this repository.
2. Copy `DATABASE_URL` from the plugin's **Connect** tab and set every variable from `.env.example` in Railway's service variables.
3. Set the Railway build command to `npm run db:generate && npm run build` and the deploy command to `npm run db:migrate && npm run start`.
4. Keep `APP_PASSWORD`, `SESSION_SECRET`, and `INGEST_SECRET` unique and private.

For an external/manual trigger, call the protected endpoint:

```sh
curl -X POST "$APP_URL/api/ingest" \
  -H "Authorization: Bearer $INGEST_SECRET"
```

The dashboard's Refresh button uses the same idempotent ingestion and matching flow for the authenticated founder. Data is deduplicated by the source award identifier.

## Data caveat

The public sources provide award notices, which identify awarded suppliers. They do not reliably expose every unsuccessful bidder. The score therefore treats verified award activity as a positive engagement signal; record known losses or research context in company notes rather than inferring them from missing data.
