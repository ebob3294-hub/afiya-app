# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Generate the Android APK (single supported method: Capacitor via terminal)

This is the one supported way to produce an APK. Prerequisites: the app is published (you have its live URL) and Android Studio is installed (it provides the Android SDK + `gradle`).

**1. Install Capacitor in the project:**

```sh
npm i @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Afya" "com.afya.app" --web-dir=dist
```

**2. Point the app at the live published site** — create `capacitor.config.ts` at the project root:

```ts
import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.afya.app",
  appName: "Afya",
  webDir: "dist",
  server: {
    // Replace with the published URL of this app
    url: "https://YOUR-PUBLISHED-URL.lovable.app",
  },
};

export default config;
```

Using `server.url` keeps all backend logic (search, barcode, AI label reading) running on the live deployment — the APK is a native shell around it.

**3. Sync and open in Android Studio (from the project root, in the Android Studio terminal or any terminal):**

```sh
npm run build
npx cap add android
npx cap sync
npx cap open android
```

**4. Build the APK — either from Android Studio (Build → Build App Bundle(s) / APK(s)) or from the terminal:**

```sh
cd android
./gradlew assembleDebug        # debug APK → android/app/build/outputs/apk/debug/
./gradlew assembleRelease      # release APK (needs a signing keystore for the Play Store)
```

To re-sync after any web change: `npm run build && npx cap sync`, then rebuild the APK.

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
