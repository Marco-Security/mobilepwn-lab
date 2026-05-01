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

  // Briefing del CTF
  scenarioDescription:
    'FakeBank es una app de banca móvil ficticia que guarda tu sesión al hacer login. ' +
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
    'Terminal / PowerShell',
    'jwt.io (opcional, para decodificar el token)',
  ],
  
  environment: [
    'Dispositivo Android con USB Debugging activado, o',
    'Emulador Android Studio (recomendado para principiantes)',
    'La app debe estar instalada como build standalone, no en Expo Go',
  ],
  
  hints: [
    'Las apps Android guardan datos en /data/data/[package_name]/',
    'AsyncStorage en React Native usa un archivo SQLite o JSON local',
    'Busca el directorio RCTAsyncLocalStorage_V1 dentro del storage de la app',
    'El archivo manifest.json contiene los pares clave-valor guardados',
  ],
  
  // Flag = parte característica del JWT que el usuario debe encontrar
  flag: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  
  validateInstructions:
    'Pega aquí el token JWT completo que extrajiste del dispositivo. La validación busca la cabecera estándar del JWT.',
  
  // Código vulnerable y fix
  vulnCode:
  `// ❌ VULNERABLE — FakeBank.js
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
  `// ✅ SEGURO — FakeBank.js
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
    description: 'Una app maliciosa registra el mismo URL scheme y roba tokens de autenticación via deep links.',
    completed: false,
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
    description: 'API keys y tokens hardcodeados en el bundle JS, extraíbles con strings o jadx.',
    completed: false,
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