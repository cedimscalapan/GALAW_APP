# TAMS Fitness

TAMS is an Ionic React fitness app based on the supplied Kabi interface references. Its core workout planning and logging, nutrition diary, and progress records are stored locally so the app remains usable offline. When configured, a Fastify API stores an encrypted-transport JSON snapshot in PostgreSQL.

## Run the app

```sh
npm install
npm run dev
```

## Build and mobile packaging

```sh
npm run build
npm run mobile:sync
npm run mobile:android
```

The `android` project is a Capacitor Android shell. iOS packaging requires macOS with Xcode. Install a PWA by serving the production build over HTTPS; the service worker caches the app shell and same-origin assets.

## Download and install from GitHub

Every push to `main` builds an installable Android debug APK through GitHub Actions.

1. Open the GitHub repository.
2. Go to **Actions**.
3. Open the latest **Build Android APK** workflow run.
4. Download the artifact named **TAMS-android-debug-apk**.
5. Extract the ZIP file and install `app-debug.apk` on an Android phone.

Android may ask you to allow installation from unknown sources. This debug APK is for testing and project checking. For Play Store release, create a signed release APK or AAB with your own signing key.

## Configure online sync

1. Create a PostgreSQL database and apply `backend/schema.sql`.
2. Copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL`.
3. Set `VITE_API_URL` in the frontend environment to the deployed API base URL.
4. Start the backend from `backend/` with `npm install` and `npm run dev`.

The client uploads its local snapshot to `POST /sync`; local changes stay on device if sync is offline or fails. The current endpoint is a per-device snapshot store, not multi-device merge or account authentication. Use TLS and add account authorization before handling real user data in a public deployment.

## Project phases and weekly checks

- **Phase 1:** Ionic tabs, TAMS branding, editable locally saved routines, and exercise targets. Demonstrate creating and reopening a routine.
- **Phase 2:** searchable exercise library, active workout, set logging, rest timer, and session history. Demonstrate a workout offline.
- **Phase 3:** nutrition diary, macro totals, measurements, history, and charts derived from saved data. Demonstrate adding a meal and viewing actual session progress.
- **Phase 4:** PostgreSQL sync API, offline pending indicator, export/restore, PWA shell, and Android Capacitor project. Demonstrate local edits, online sync, and backup restore.

Photo nutrition estimation is an integration point and needs a configured recognition service; the app explicitly identifies this instead of inventing nutrition results. The official app branding uses only `APPLOGO.png` and `APPMASCOT.png`.
