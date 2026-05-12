export const challenges = [
  {
    id: 'm1',
    title: 'AsyncStorage Inseguro',
    category: 'M1 - Credenciales',
    difficulty: 'Fácil',
    points: 100,
    icon: 'lock-open',
    color: '#00ff41',
    description: 'Tokens JWT almacenados en texto plano. Un atacante con acceso al dispositivo puede extraerlos trivialmente.',
    completed: false,

    scenarioDescription:
      'AnclaBank es una app de banca móvil ficticia que guarda tu sesión al hacer login. ' +
      'El desarrollador eligió AsyncStorage para almacenar el token JWT por simplicidad. ' +
      'Tu trabajo es demostrar por qué fue una mala decisión.',

    credentials: {
      user: 'admin',
      pass: 'admin123',
    },

    objective:
      'Extrae el token JWT de sesión que la app guarda en el storage del dispositivo, sin modificar el código de la app.',

    tools: [
      'adb (Android Debug Bridge)',
      'Una terminal en tu sistema operativo',
      'Conocimiento básico de filesystem Linux/Unix',
    ],

    environment: [
      'Dispositivo Android con USB Debugging activado, o',
      'Emulador Android Studio (recomendado para principiantes)',
      'La app debe estar instalada como build standalone, no en Expo Go',
    ],

    hints: [
      'Las apps con su propio sandbox guardan datos en una ruta predecible del sistema, ¿la conoces?',
      'ADB tiene un comando que te permite actuar con la identidad de una app específica, si esta lo permite',
      'Las librerías de almacenamiento suelen tener nombres internos distintos a los que ves en el código fuente',
      'No todos los archivos se ven como esperas si los abres con la herramienta equivocada',
    ],

    flag: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',

    validateInstructions:
      'Pega aquí el token JWT completo que extrajiste del dispositivo. La validación busca la cabecera estándar del JWT.',

    vulnCode:
      `// ❌ VULNERABLE — AnclaBank.js
      import AsyncStorage from '@react-native-async-storage/async-storage';

      async function saveSession(token) {
        // El token se guarda como texto plano
        // en el storage privado de la app.
        // Accesible vía ADB sin necesidad de root
        // en builds debug.
        await AsyncStorage.setItem('bank_auth_token', token);
      }

      async function getSession() {
        return await AsyncStorage.getItem('bank_auth_token');
      }`,

    fixCode:
      `// ✅ SEGURO — AnclaBank.js
      import * as SecureStore from 'expo-secure-store';

      async function saveSession(token) {
        // Cifrado a nivel hardware:
        // - iOS: Keychain
        // - Android: Keystore
        // No accesible desde ADB ni otras apps.
        await SecureStore.setItemAsync('bank_auth_token', token);
      }

      async function getSession() {
        return await SecureStore.getItemAsync('bank_auth_token');
      }`,

    fixExplanation:
      'expo-secure-store delega el almacenamiento al sistema operativo. En iOS usa el ' +
      'Keychain y en Android el Keystore. Los datos quedan cifrados a nivel hardware, ' +
      'ligados al dispositivo y al usuario. No son accesibles desde ADB ni desde otras ' +
      'apps, incluso con acceso root en dispositivos no comprometidos.',

    rules: [
      'Nunca uses AsyncStorage para tokens, contraseñas o datos sensibles',
      'SecureStore para cualquier credencial o token de sesión',
      'Para datos sensibles voluminosos, usa SQLCipher o Realm con cifrado',
      'En arquitecturas críticas, considera tokens de corta duración + refresh',
    ],
  },
  {
    id: 'm2',
    title: 'Deep Link Hijacking',
    category: 'M2 - Auth',
    difficulty: 'Medio',
    points: 200,
    icon: 'link',
    color: '#0af',
    description: 'Magic links con tokens de sesión completos en la URL son interceptables vía logs del sistema.',
    completed: false,

    scenarioDescription:
      'AnclaBank ofrece una función de "Acceso rápido" que permite al usuario abrir su sesión en otros dispositivos vinculados. Para hacerlo simple, el desarrollador decidió enviar el token de sesión directamente como parámetro en el URL del magic link. Su razonamiento fue: "como el link expira en 5 minutos, no hay riesgo." Demuéstrale que se equivocó.',

    objective:
      'Captura el JWT de sesión que viaja en el URL del magic link, sin necesidad de tener acceso autenticado a la app.',

    tools: [
      'adb (Android Debug Bridge)',
      'Una terminal en tu sistema operativo',
      'Conocimiento básico de filtrado de texto en CLI',
    ],

    environment: [
      'Dispositivo Android con USB Debugging activado, o',
      'Emulador Android Studio',
      'La app debe estar instalada como build standalone para reproducir logs reales',
    ],

    hints: [
      'Las apps registran eventos del sistema en un buffer central observable desde fuera, ¿conoces el comando?',
      'Los logs son ruidosos — necesitas una forma de filtrar por algo distintivo',
      'Tu app loguea con un prefijo que la identifica claramente. Búscalo en el código de Scenario',
      'Generar el link en la app y capturar logs son acciones que se hacen en paralelo, no en secuencia',
    ],

    flag: 'anclabank://quicklogin',

    validateInstructions:
      'Pega aquí el URL completo del magic link que capturaste en los logs del dispositivo.',

    vulnCode:
      `// ❌ VULNERABLE — AnclaBank.js
      async function generateQuickLoginLink() {
        const token = await getSessionToken();
        const expiresIn = 300; // 5 minutos

        // El JWT completo viaja en la URL como parámetro.
        // Cualquiera con acceso a logs del sistema puede extraerlo.
        const magicLink = \`anclabank://quicklogin?token=\${token}&expires=\${expiresIn}\`;

        // Log "para debugging" — queda en logcat indefinidamente.
        console.log('[ANCLABANK_QUICKLOGIN] Generated:', magicLink);

        return magicLink;
      }`,

    fixCode:
      `// ✅ SEGURO — AnclaBank.js
      async function generateQuickLoginLink() {
        // El servidor genera un código de UN SOLO USO,
        // ligado a la sesión actual y de corta duración.
        const oneTimeCode = await api.requestQuickLoginCode();

        // El URL solo lleva el código, NUNCA el token de sesión.
        const magicLink = \`anclabank://quicklogin?code=\${oneTimeCode}\`;

        // Si necesitas debug, NUNCA loguees el URL completo.
        // En producción, elimina cualquier console.log de URLs.
        if (__DEV__) {
          console.log('[ANCLABANK] Quick login link generated (code redacted)');
        }

        return magicLink;
      }

      // Al recibir el deep link, la app intercambia el código:
      //   POST /quicklogin/exchange { code }
      //   → respuesta: { token }
      // El servidor invalida el código tras el primer uso.`,

    fixExplanation:
      'Un código de un solo uso (one-time code) cambia radicalmente el modelo de amenaza. ' +
      'Aunque el atacante capture el código de los logs, ya fue consumido por el dispositivo legítimo ' +
      'y el servidor lo rechazará. El JWT real nunca viaja por canales observables — se intercambia ' +
      'directamente entre cliente y servidor vía HTTPS. Adicionalmente, todo console.log de URLs ' +
      'sensibles debe estar guardado tras la flag __DEV__ de React Native, que se elimina en builds ' +
      'de producción automáticamente.',

    rules: [
      'Nunca incluyas tokens, contraseñas o datos sensibles en URLs de deep links',
      'Usa códigos de un solo uso para flujos de autenticación cross-device',
      'Elimina o condiciona con __DEV__ todo console.log que pueda contener datos sensibles',
      'Considera Android App Links (HTTPS verificados) sobre Custom URL Schemes para flujos críticos',
      'En auditorías, busca console.log y Log.d en el código fuente — son fuentes comunes de fuga',
    ],
  },
  {
    id: 'm3',
    title: 'Biometric Bypass',
    category: 'M3 - Auth',
    difficulty: 'Medio',
    points: 200,
    icon: 'finger-print',
    color: '#0af',
    description: 'Fallback débil en autenticación biométrica permite bypass con PIN trivial o Frida hooks.',
    completed: false,
  },
  {
    id: 'm4',
    title: 'JS Bundle Tampering',
    category: 'M4 - RN Específico',
    difficulty: 'Difícil',
    points: 300,
    icon: 'code-slash',
    color: '#ff6b35',
    description: 'El bundle .jsbundle de React Native puede extraerse, modificarse y reempaquetarse sin detección.',
    completed: false,
  },
  {
    id: 'm5',
    title: 'Certificate Pinning Bypass',
    category: 'M5 - Comunicación',
    difficulty: 'Difícil',
    points: 300,
    icon: 'shield',
    color: '#ff6b35',
    description: 'Bypass de certificate pinning con Frida para interceptar tráfico HTTPS cifrado.',
    completed: false,
  },
  {
  id: 'm6',
  title: 'Hardcoded Secrets',
  category: 'M6 - Configuración',
  difficulty: 'Fácil',
  points: 100,
  icon: 'key',
  color: '#00ff41',
  description: 'API keys hardcodeadas en el bundle JS son extraíbles con herramientas estándar de análisis estático.',
  completed: false,

  scenarioDescription:
    'AnclaBank integró un servicio de analytics de terceros para monitorear ' +
    'el comportamiento de usuarios. El desarrollador hardcodeó la API key del ' +
    'servicio directamente en el código para "simplificar el desarrollo" y nunca ' +
    'la removió antes de lanzar a producción. Un atacante con acceso al APK ' +
    'puede extraerla en minutos.',

  objective:
    'Extrae la API key del servicio de analytics hardcodeada en el bundle JS de la app.',

  tools: [
    'adb (Android Debug Bridge)',
    'strings (herramienta de extracción de texto)',
    'grep o findstr para filtrado',
    'Una terminal Linux/Mac (recomendado) o PowerShell',
  ],

  environment: [
    'Dispositivo Android con USB Debugging activado, o',
    'Emulador Android Studio',
    'La app debe estar instalada como build standalone',
    'Recomendado: entorno Linux o Mac para usar strings nativo',
  ],

  hints: [
    'Un APK es un archivo comprimido — cualquier descompresor puede abrirlo',
    'Las apps React Native empaquetan todo su código en un solo archivo dentro de assets/',
    'Las API keys de servicios suelen tener prefijos reconocibles. Busca en el bundle por el nombre del servicio que aparece en el scenario.',
  ],

  flag: 'ANCLA-PROD-sk-live-x9f2mK8nQpL3rT7w',

  validateInstructions:
    'Pega aquí la API key completa que encontraste en el bundle JS.',

  vulnCode:
    `// ❌ VULNERABLE — analytics.js
    // API key hardcodeada directamente en el código cliente.
    // Visible para cualquiera que extraiga y analice el APK.
    const ANALYTICS_CONFIG = {
      service: 'AnclaAnalytics',
      endpoint: 'https://analytics.anclabank.io/v2/track',
      apiKey: 'ANCLA-PROD-sk-live-x9f2mK8nQpL3rT7w',
      environment: 'production',
    };

    // Un atacante solo necesita:
    // 1. adb pull para descargar el APK
    // 2. unzip para extraer el bundle
    // 3. strings + grep para encontrar la key`,

  fixCode:
    `// ✅ SEGURO — analytics.js

    // Opción 1: La API key vive en el servidor, nunca en el cliente.
    // La app llama a tu propio backend, que llama al servicio de analytics.
    // POST /api/track → tu servidor → AnclaAnalytics (con la key segura)

    // Opción 2: Para keys que DEBEN estar en el cliente (ej. Google Maps),
    // usa restricciones por plataforma en la consola del proveedor:
    // - Restringir a tu package name (Android)
    // - Restringir a tu bundle ID (iOS)
    // - Restringir por IP si es posible

    // Opción 3: Usa variables de entorno en el build pipeline.
    // La key se inyecta en tiempo de build, no en el código fuente.
    // Nunca commitees .env a git.
    const ANALYTICS_CONFIG = {
      service: 'AnclaAnalytics',
      endpoint: 'https://analytics.anclabank.io/v2/track',
      apiKey: process.env.ANALYTICS_API_KEY, // inyectada en build time
      environment: process.env.NODE_ENV,
    };`,

  fixExplanation:
    'El problema fundamental es que el código de una app móvil es completamente ' +
    'reversible. Todo lo que pongas en el bundle JS puede ser extraído. Una API key ' +
    'de producción expuesta permite a un atacante hacer llamadas ilimitadas al servicio ' +
    'en tu nombre, generando costos, exfiltrando datos de usuarios, o comprometiendo ' +
    'la infraestructura completa si es una key de AWS o GCP. ' +
    'El fix correcto es nunca enviar secrets al cliente — toda llamada sensible ' +
    'debe pasar por un backend que tú controlas.',

  rules: [
    'Nunca hardcodees API keys, tokens o secrets en código cliente',
    'Usa variables de entorno inyectadas en build time, no en runtime',
    'Toda llamada a servicios de terceros debe pasar por tu propio backend',
    'Aplica restricciones por plataforma en las consolas de los proveedores de API',
    'En auditorías, busca patrones sk_live_, pk_live_, AKIA (AWS) en el bundle JS',
    'Escanea tu repositorio con herramientas como truffleHog o git-secrets antes de cada release',
  ],
  },
  {
    id: 'm7',
    title: 'WebView XSS',
    category: 'M7 - WebView',
    difficulty: 'Medio',
    points: 200,
    icon: 'globe',
    color: '#0af',
    description: 'XSS en WebView con JavascriptInterface expuesto permite acceso a APIs nativas del dispositivo.',
    completed: false,
  },
  {
    id: 'm8',
    title: 'SQLite Injection',
    category: 'M8 - Storage',
    difficulty: 'Medio',
    points: 200,
    icon: 'server',
    color: '#0af',
    description: 'SQL injection en react-native-sqlite-storage por concatenación directa de inputs del usuario.',
    completed: false,
  },
  {
    id: 'm9',
    title: 'MITM - Tráfico HTTP',
    category: 'M9 - Red',
    difficulty: 'Fácil',
    points: 100,
    icon: 'wifi',
    color: '#00ff41',
    description: 'Intercepción de tráfico HTTP sin TLS en red local con Burp Suite o tcpdump.',
    completed: false,
  },
  {
    id: 'm10',
    title: 'Full Chain Attack',
    category: 'M10 - Kill Chain',
    difficulty: 'Experto',
    points: 500,
    icon: 'skull',
    color: '#ff2d55',
    description: 'Ataque completo: reconocimiento → explotación → persistencia → C2 beacon → exfiltración.',
    completed: false,
  },
];