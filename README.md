# Notiminder

A polished reminder PWA with native browser notifications, an installable manifest, service worker support, and a touch-friendly time dial.

## Run locally

```powershell
python -m http.server 5173 --bind 127.0.0.1
```

Then open `http://127.0.0.1:5173/index.html` and tap **Native alerts** to allow real system notifications.

## Mobile notes

- Android Chrome can install the app from the browser install prompt and show native web notifications after permission is allowed.
- iPhone/iPad support requires adding the web app to the Home Screen on supported iOS/iPadOS versions before web push style notifications are available.
- This static version schedules reminders while the app/browser context is running. Fully reliable closed-app delivery on phones needs a push backend or a native wrapper such as Capacitor.
