import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { challenges } from '../data/challenges';

// ─── Tab Button ───────────────────────────────────────────────
function TabButton({ label, active, locked, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.tabButton, active && styles.tabButtonActive]}
      onPress={locked ? null : onPress}
      disabled={locked}
    >
      {locked && (
        <Ionicons name="lock-closed" size={11} color={colors.textSecondary} />
      )}
      <Text style={[styles.tabLabel, active && styles.tabLabelActive, locked && styles.tabLabelLocked]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Code Block ───────────────────────────────────────────────
function CodeBlock({ code }) {
  return (
    <View style={styles.codeWrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Text style={styles.codeText}>{code}</Text>
      </ScrollView>
    </View>
  );
}

// ─── Tab: Info ────────────────────────────────────────────────
function InfoTab({ challenge }) {
  return (
    <ScrollView>
      <View style={styles.tabContent}>
        <View style={styles.metaRow}>
          <View style={[styles.badge, { borderColor: challenge.color }]}>
            <Text style={[styles.badgeText, { color: challenge.color }]}>
              {challenge.difficulty}
            </Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{challenge.points} pts</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{challenge.category}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>// escenario</Text>
        <Text style={styles.bodyText}>
          {challenge.scenarioDescription || challenge.description}
        </Text>

        {challenge.credentials && (
          <>
            <Text style={styles.sectionTitle}>// credenciales de prueba</Text>
            <View style={styles.credBox}>
              <Text style={styles.credLine}>
                <Text style={styles.credLabel}>usuario: </Text>
                <Text style={styles.credValue}>{challenge.credentials.user}</Text>
              </Text>
              <Text style={styles.credLine}>
                <Text style={styles.credLabel}>contraseña: </Text>
                <Text style={styles.credValue}>{challenge.credentials.pass}</Text>
              </Text>
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>// objetivo</Text>
        <Text style={styles.bodyText}>
          {challenge.objective ||
            'Extrae el dato sensible usando las herramientas indicadas y valídalo en el tab Validate.'}
        </Text>

        <Text style={styles.sectionTitle}>// herramientas necesarias</Text>
        {(challenge.tools || ['ADB', 'Terminal']).map((tool, i) => (
          <View key={i} style={styles.bulletRow}>
            <Text style={styles.bullet}>$</Text>
            <Text style={styles.bulletText}>{tool}</Text>
          </View>
        ))}

        {challenge.environment && (
          <>
            <Text style={styles.sectionTitle}>// entorno requerido</Text>
            {challenge.environment.map((env, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={[styles.bullet, { color: colors.info }]}>·</Text>
                <Text style={styles.bulletText}>{env}</Text>
              </View>
            ))}
          </>
        )}

        <Text style={styles.sectionTitle}>// referencias</Text>
        <Text style={styles.referenceText}>
          OWASP Mobile Top 10 2024 — {challenge.category}
        </Text>
        <Text style={styles.referenceText}>MASVS 2.0 — MSTG</Text>
      </View>
    </ScrollView>
  );
}

// ─── Tab: Scenario ────────────────────────────────────────────
function ScenarioTab({ challenge }) {
  return (
    <ScrollView>
      <View style={styles.tabContent}>
        <View style={styles.scenarioHeader}>
          <Ionicons name="warning" size={14} color={colors.accent} />
          <Text style={styles.scenarioWarning}>
            Esta app contiene código vulnerable intencionalmente. Tu objetivo es encontrar el dato sensible usando herramientas externas.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>// escenario</Text>
        <Text style={styles.bodyText}>
          {challenge.scenarioDescription || 'Una app bancaria guarda tu sesión en el dispositivo al hacer login. Encuentra dónde y cómo está almacenada.'}
        </Text>

        {challenge.ScenarioComponent ? (
          <challenge.ScenarioComponent />
        ) : (
          <DefaultBankingScenario />
        )}

        <Text style={styles.sectionTitle}>// pistas de ataque</Text>
        {(challenge.hints || [
          'Conéctate al dispositivo via ADB',
          'Explora el directorio de datos de la app',
          'Busca archivos de storage local',
        ]).map((hint, i) => (
          <View key={i} style={styles.hintRow}>
            <Text style={styles.hintIndex}>{i + 1}</Text>
            <Text style={styles.hintText}>{hint}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// ─── Scenario por defecto: Mini-app bancaria ──────────────────
function DefaultBankingScenario() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');

  const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWRtaW4iLCJyb2xlIjoic3VwZXJ1c2VyIiwiYmFsYW5jZSI6Ijk5OTk5In0.DEMO_SIGNATURE';

  async function handleLogin() {
    if (user !== 'admin' || pass !== 'admin123') {
      setMessage('Credenciales incorrectas. Prueba con las credenciales de prueba.');
      return;
    }

    try {
      // VULNERABILIDAD INTENCIONAL: AsyncStorage guarda en texto plano
      // Esto es lo que el atacante extraerá con `adb run-as`
      await AsyncStorage.setItem('bank_auth_token', fakeToken);
      await AsyncStorage.setItem('bank_user_data', JSON.stringify({
        user: 'admin',
        role: 'superuser',
        balance: 99999,
        session_started: new Date().toISOString(),
      }));
      setLoggedIn(true);
      setMessage('');
    } catch (e) {
      // Si el storage falla, el login NO debe avanzar
      setMessage('Error al guardar la sesión: ' + e.message);
    }
  }

  if (loggedIn) {
    return (
      <View style={styles.bankApp}>
        <Text style={styles.bankTitle}>🏦 FakeBank</Text>
        <Text style={styles.bankWelcome}>Bienvenido, admin</Text>
        <View style={styles.bankCard}>
          <Text style={styles.bankLabel}>Saldo disponible</Text>
          <Text style={styles.bankBalance}>$99,999.00</Text>
        </View>
        <View style={styles.bankAlert}>
          <Ionicons name="information-circle" size={14} color={colors.info} />
          <Text style={styles.bankAlertText}>
            Sesión iniciada. Tu token de sesión ha sido guardado en el dispositivo.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.bankApp}>
      <Text style={styles.bankTitle}>🏦 FakeBank</Text>
      <Text style={styles.bankSubtitle}>Inicia sesión para continuar</Text>

      <TextInput
        style={styles.bankInput}
        placeholder="Usuario"
        placeholderTextColor={colors.textSecondary}
        value={user}
        onChangeText={setUser}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.bankInput}
        placeholder="Contraseña"
        placeholderTextColor={colors.textSecondary}
        value={pass}
        onChangeText={setPass}
        secureTextEntry
      />

      {message !== '' && (
        <Text style={styles.bankError}>{message}</Text>
      )}

      <TouchableOpacity style={styles.bankButton} onPress={handleLogin}>
        <Text style={styles.bankButtonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      <Text style={styles.bankHint}>
        Credenciales de prueba disponibles en el briefing
      </Text>
    </View>
  );
}

// ─── Tab: Validate ────────────────────────────────────────────
function ValidateTab({ challenge, onComplete }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null); // null | 'correct' | 'wrong'

  function handleValidate() {
    const answer = (challenge.flag || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9').trim();
    if (input.trim().includes(answer)) {
      setResult('correct');
      onComplete();
    } else {
      setResult('wrong');
    }
  }

  return (
    <ScrollView>
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>// valida tu hallazgo</Text>
        <Text style={styles.bodyText}>
          {challenge.validateInstructions ||
            'Pega aquí el token JWT que encontraste en el storage del dispositivo.'}
        </Text>

        <TextInput
          style={styles.flagInput}
          placeholder="Pega aquí lo que encontraste..."
          placeholderTextColor={colors.textSecondary}
          value={input}
          onChangeText={setInput}
          multiline
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity style={styles.validateButton} onPress={handleValidate}>
          <Ionicons name="checkmark-circle-outline" size={18} color={colors.background} />
          <Text style={styles.validateButtonText}>validar</Text>
        </TouchableOpacity>

        {result === 'correct' && (
          <View style={styles.resultBox}>
            <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.resultCorrect}>¡Correcto!</Text>
              <Text style={styles.resultText}>
                Encontraste el dato sensible. El tab Fix se ha desbloqueado.
              </Text>
            </View>
          </View>
        )}

        {result === 'wrong' && (
          <View style={[styles.resultBox, { borderColor: colors.danger }]}>
            <Ionicons name="close-circle" size={20} color={colors.danger} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.resultWrong}>Incorrecto</Text>
              <Text style={styles.resultText}>
                Sigue explorando. Revisa las pistas en el tab Scenario.
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// ─── Tab: Fix ─────────────────────────────────────────────────
function FixTab({ challenge }) {
  return (
    <ScrollView>
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>// código vulnerable</Text>
        <CodeBlock code={challenge.vulnCode ||
        `// ❌ VULNERABLE
        import AsyncStorage from '@react-native-async-storage/async-storage';

        async function saveToken(token) {
        // Texto plano, accesible con ADB sin root
        await AsyncStorage.setItem('bank_auth_token', token);
      }`} />

        <Text style={styles.sectionTitle}>// fix correcto</Text>
        <CodeBlock code={challenge.fixCode ||
        `// ✅ SEGURO
        import * as SecureStore from 'expo-secure-store';

        async function saveToken(token) {
        // Cifrado a nivel hardware (Keychain / Keystore)
        await SecureStore.setItemAsync('bank_auth_token', token);
      }`} />

        <Text style={styles.sectionTitle}>// ¿por qué funciona?</Text>
        <Text style={styles.bodyText}>
          {challenge.fixExplanation ||
            'expo-secure-store delega el almacenamiento al sistema operativo. ' +
            'En iOS usa el Keychain y en Android el Keystore. Los datos quedan ' +
            'cifrados a nivel hardware, ligados al dispositivo y al usuario. ' +
            'No son accesibles desde ADB ni desde otras apps, incluso con acceso root ' +
            'en dispositivos no comprometidos.'}
        </Text>

        <Text style={styles.sectionTitle}>// reglas generales</Text>
        {(challenge.rules || [
          'Nunca uses AsyncStorage para tokens, contraseñas o datos sensibles',
          'SecureStore para cualquier credencial o token de sesión',
          'Cifra cualquier dato sensible adicional en base de datos local',
        ]).map((rule, i) => (
          <View key={i} style={styles.bulletRow}>
            <Text style={[styles.bullet, { color: colors.primary }]}>✓</Text>
            <Text style={styles.bulletText}>{rule}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// ─── Pantalla principal ───────────────────────────────────────
export default function ChallengeScreen({ route }) {
  const { id } = route.params;
  const challenge = challenges.find((c) => c.id === id);
  const [activeTab, setActiveTab] = useState('info');
  const [completed, setCompleted] = useState(false);

  const tabs = [
    { key: 'info',     label: 'Info',     locked: false },
    { key: 'scenario', label: 'Scenario', locked: false },
    { key: 'validate', label: 'Validate', locked: false },
    { key: 'fix',      label: 'Fix',      locked: !completed },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TabButton
            key={tab.key}
            label={tab.label}
            active={activeTab === tab.key}
            locked={tab.locked}
            onPress={() => setActiveTab(tab.key)}
          />
        ))}
      </View>

      {activeTab === 'info'     && <InfoTab challenge={challenge} />}
      {activeTab === 'scenario' && <ScenarioTab challenge={challenge} />}
      {activeTab === 'validate' && (
        <ValidateTab
          challenge={challenge}
          onComplete={() => {
            setCompleted(true);
            setActiveTab('fix');
          }}
        />
      )}
      {activeTab === 'fix'      && <FixTab challenge={challenge} />}
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabLabel: {
    color: colors.textSecondary,
    fontFamily: 'monospace',
    fontSize: 12,
  },
  tabLabelActive: {
    color: colors.primary,
  },
  tabLabelLocked: {
    color: colors.border,
  },
  tabContent: {
    padding: 16,
    gap: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: colors.textSecondary,
    fontFamily: 'monospace',
    fontSize: 11,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontFamily: 'monospace',
    fontSize: 13,
    marginTop: 8,
  },
  bodyText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  bullet: {
    color: colors.accent,
    fontFamily: 'monospace',
    fontSize: 13,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  referenceText: {
    color: colors.textSecondary,
    fontFamily: 'monospace',
    fontSize: 12,
  },
  hintRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  hintIndex: {
    color: colors.accent,
    fontFamily: 'monospace',
    fontSize: 13,
    width: 16,
  },
  hintText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  scenarioHeader: {
    flexDirection: 'row',
    gap: 8,
    padding: 10,
    backgroundColor: colors.card,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'flex-start',
  },
  scenarioWarning: {
    flex: 1,
    color: colors.accent,
    fontSize: 12,
    lineHeight: 18,
  },
  bankApp: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    gap: 12,
    marginTop: 8,
  },
  bankTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bankSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },
  bankWelcome: {
    color: colors.primary,
    fontFamily: 'monospace',
    fontSize: 14,
    textAlign: 'center',
  },
  bankCard: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  bankLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  bankBalance: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  bankAlert: {
    flexDirection: 'row',
    gap: 8,
    padding: 10,
    backgroundColor: colors.card,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.info,
    alignItems: 'flex-start',
  },
  bankAlertText: {
    flex: 1,
    color: colors.info,
    fontSize: 12,
    lineHeight: 18,
  },
  bankInput: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 12,
    color: colors.textPrimary,
    fontFamily: 'monospace',
    fontSize: 13,
  },
  bankError: {
    color: colors.danger,
    fontSize: 12,
    fontFamily: 'monospace',
  },
  bankButton: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  bankButtonText: {
    color: colors.background,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    fontSize: 14,
  },
  bankHint: {
    color: colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  flagInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 12,
    color: colors.primary,
    fontFamily: 'monospace',
    fontSize: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  validateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: 6,
    paddingVertical: 12,
  },
  validateButtonText: {
    color: colors.background,
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 'bold',
  },
  resultBox: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    backgroundColor: colors.card,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'flex-start',
  },
  resultCorrect: {
    color: colors.primary,
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 'bold',
  },
  resultWrong: {
    color: colors.danger,
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 'bold',
  },
  resultText: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  codeWrapper: {
    backgroundColor: colors.surface,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
  },
  codeText: {
    color: colors.textCode,
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 20,
  },
  credBox: {
  backgroundColor: colors.surface,
  borderWidth: 1,
  borderColor: colors.primary,
  borderRadius: 6,
  padding: 12,
  gap: 4,
},
credLine: {
  fontFamily: 'monospace',
  fontSize: 13,
},
credLabel: {
  color: colors.textSecondary,
},
credValue: {
  color: colors.primary,
  fontWeight: 'bold',
},
});