# Authentication and account data

## Environment variables

Configure these on the Render backend service (Dashboard → service → Environment):

- `MONGODB_URI`: existing MongoDB connection string.
- `GEMINI_API_KEY`: existing Gemini key.
- `AUTH_TOKEN_SECRET`: a new, random secret used to sign sessions. Generate a long value (for example, with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`). Never commit the value.
- `FRONTEND_ORIGIN` (optional): your deployed Vercel origin, e.g. `https://smart-resume-screener-livid.vercel.app`.

On Vercel, set `VITE_API_URL` to the Render backend origin, without a trailing slash, e.g. `https://smart-resume-screener-ld8v.onrender.com`. Redeploy after changing environment variables.

## What the app saves

- User account: name, normalized email, and a salted password hash in MongoDB. Plain-text passwords are never stored.
- Screening history: parsed resume fields, job description, and AI match results are associated with the authenticated user.
- Original uploaded PDFs are temporary processing inputs and are deleted from the backend filesystem after parsing.

## Account controls

Open the account menu in the top navigation:
- **Clear screening history** removes saved screening records but keeps the login account.
- **Delete account** permanently removes the account and its screening records.
- **Sign out** clears the browser's saved session.

These deletion actions are permanent. This feature deletes records from the app's MongoDB collections; it does not erase copies a user may have separately downloaded or stored elsewhere.

## API endpoints

- `POST /api/auth/signup` — name, email, password
- `POST /api/auth/login` — email, password
- `GET /api/auth/me` — current authenticated account
- `DELETE /api/auth/data` — delete this account's screening history
- `DELETE /api/auth/account` — delete this account and its screening history
- `GET /api/candidates` and `GET /api/candidates/:id` — authenticated, account-scoped screening history
- `POST /api/job/match` — requires a signed-in account and saves results under that account

The backend uses signed bearer sessions with a seven-day expiry. For production use, also configure request rate limiting and HTTPS (Vercel and Render provide HTTPS on their hosted domains).
