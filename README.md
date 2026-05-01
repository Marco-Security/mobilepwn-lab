# MobilePwn Lab

> Interactive mobile security training platform — OWASP Mobile Top 10 2024 hands-on labs

[![React Native](https://img.shields.io/badge/React%20Native-0.81-61dafb?logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?logo=expo)](https://expo.dev/)
[![OWASP](https://img.shields.io/badge/OWASP-Mobile%20Top%2010%202024-000000)](https://owasp.org/www-project-mobile-top-10/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## Overview

MobilePwn Lab is a cross-platform mobile application designed to teach mobile application security through hands-on Capture-The-Flag style challenges. Each module presents an intentionally vulnerable scenario that the learner must exploit using **real external tooling** (ADB, Frida, Burp Suite, jadx, etc.) — not simulated buttons.

The platform is aligned with the **OWASP Mobile Top 10 (2024)** and **MASVS 2.0** frameworks, addressing modern vulnerabilities specific to React Native and hybrid architectures that are not covered by older training apps.

## Why this project exists

Existing mobile security training apps (InsecureBankv2, OWASP iGoat, etc.) are valuable but increasingly outdated — they predate the OWASP Mobile Top 10 2024 update and rarely cover React Native-specific attack surfaces. MobilePwn Lab fills that gap with an active-learning approach: the app provides realistic vulnerable scenarios; the learner uses real attacker tooling to exploit them.

## Modules

| # | Module | Vulnerability | Tools |
|---|--------|---------------|-------|
| M1 | AsyncStorage Insecure Storage | Plaintext JWT in local storage | ADB |
| M2 | Deep Link Hijacking | URL scheme / intent abuse | ADB intents |
| M3 | Biometric Auth Bypass | Weak fallback / Frida hooks | Frida |
| M4 | JS Bundle Tampering | Bundle extraction & modification | adb, strings |
| M5 | Certificate Pinning Bypass | TLS interception via Frida | Frida + Burp |
| M6 | Hardcoded Secrets | API keys in JS bundle | strings, jadx |
| M7 | WebView XSS | JavaScriptInterface abuse | Manual payloads |
| M8 | SQLite Injection | Unsanitized local queries | adb shell, sqlite3 |
| M9 | Insecure Network Traffic | Plaintext HTTP MITM | Burp, tcpdump |
| M10 | Full Chain Attack | Recon → Exploit → Persistence → C2 | All of the above |

## Architecture

Each challenge follows a consistent four-phase CTF flow:

```
Info  →  Scenario  →  Validate  →  Fix
        (vulnerable    (learner pegs   (unlocks after
         mini-app)      what they       successful
                        extracted)      validation)
```

The **Fix** tab remains locked until the learner successfully completes the **Validate** phase, ensuring the learning happens through actual exploitation rather than passive reading.

## Tech stack

- **React Native** (Expo SDK 54)
- **React Navigation** (Bottom Tabs + Stack)
- **expo-secure-store** for the secure-by-default examples
- **@react-native-async-storage/async-storage** for the vulnerable examples

## Getting started

### Requirements

- Node.js ≥ 20
- npm ≥ 10
- Expo Go app (for development) or EAS Build (for full CTF gameplay)

### Installation

```bash
git clone https://github.com/Marco-Security/mobilepwn-lab.git
cd mobilepwn-lab
npm install
npx expo start
```

> **Note:** Several modules (M1, M4, M6, M8) require a standalone build to be fully playable, since they depend on accessing the app's private storage via ADB. Use `eas build --profile development` to generate an installable APK.

## Disclaimer

This application is provided **strictly for educational purposes**. All vulnerabilities demonstrated occur within the application's own sandboxed environment. No real systems, third-party services, or user data are compromised during the exercises.

The techniques taught should only be applied:
- In isolated lab environments
- Against systems for which explicit written authorization has been granted
- In compliance with local laws and ethical hacking standards

## References

- [OWASP Mobile Top 10 — 2024](https://owasp.org/www-project-mobile-top-10/)
- [OWASP MASVS 2.0](https://mas.owasp.org/MASVS/)
- [OWASP MASTG](https://mas.owasp.org/MASTG/)
- [React Native Security Documentation](https://reactnative.dev/docs/security)

## Author

**Marco** ([@Marco-Security](https://github.com/Marco-Security))
SOC Analyst in training | MSc Applied Physics 

## License

MIT — see [LICENSE](LICENSE) for details.
