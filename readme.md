# Maps n Bags [Backend]

## RUN
> npm install
> npm run dev

## Technologies
<!-- - Docker -->
- Node 18
- Express
- Typescript [NO]
- Postgres (NeonDB)
  
### Misc
- [TypeScript Playground](https://www.typescriptlang.org/play)
- Use the ES modules like this ~ `import express from 'express';`

---

## Deploying to Netlify

This project uses [`serverless-http`](https://github.com/dougmoscrop/serverless-http) to wrap the Express app as a Netlify Function. No changes are needed to routes, controllers, or middleware.

### Steps

1. Push this repository to GitHub and connect it to a new Netlify site.
2. Netlify will automatically detect `netlify.toml` and use the correct build settings.
3. Set the following environment variables in **Netlify → Site Settings → Environment Variables**:

| Variable | Description |
|---|---|
| `DB_HOST` | PostgreSQL host (e.g. NeonDB hostname) |
| `DB_NAME` | Database name |
| `DB_USER` | Database username |
| `DB_PASS` | Database password |
| `JWT_SECRET` | Secret used to sign/verify JWT tokens |
| `NODE_ENV` | Set to `production` (enables JWT auth enforcement) |
| `ALLOWED_ORIGIN` | *(Optional)* Allowed CORS origin, e.g. `https://yourapp.netlify.app`. Defaults to `*` if not set. |

4. Run `npm run db:sync` locally (or as a one-off command) when you need to apply schema changes to the database. The build command in `netlify.toml` runs this automatically on each deploy — remove it from `netlify.toml` if you prefer to manage migrations manually.

### How it works

- `netlify/functions/api.js` wraps the Express app using `serverless-http`.
- `netlify.toml` rewrites all requests (`/*`) to `/.netlify/functions/api/:splat`, so URLs like `/api/user` work as expected.
- Running `node app.js` directly still starts a traditional HTTP server on `process.env.PORT` (default `8888`), so the app is not locked in to Netlify.

### Local development

```
cp .env.example .env   # fill in your local DB and JWT values
npm run db:sync        # create/alter tables (only needed after model changes)
npm run dev            # start with nodemon
```