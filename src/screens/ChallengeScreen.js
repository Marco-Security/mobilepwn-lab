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
import { colors } from '../theme/colors';
import { challenges } from '../data/challenges';

import TabButton from '../components/TabButton';
import CodeBlock from '../components/CodeBlock';
import M1AsyncStorageScenario from '../scenarios/M1AsyncStorageScenario';
import M2DeepLinkScenario from '../scenarios/M2DeepLinkScenario';
import ConfettiCannon from 'react-native-confetti-cannon';

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
  // Mapa de scenarios disponibles. Cada nuevo módulo se registra aquí.
  const scenarios = {
    m1: M1AsyncStorageScenario,
    m2: M2DeepLinkScenario,
  };

  const ScenarioComponent = scenarios[challenge.id];

  return (
    <ScrollView>
      <View style={styles.tabContent}>
        <View style={styles.scenarioHeader}>
          <Ionicons name="warning" size={14} color={colors.accent} />
          <Text style={styles.scenarioWarning}>
            Esta app contiene código vulnerable intencionalmente. Tu objetivo es encontrar
            el dato sensible usando herramientas externas.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>// escenario</Text>
        <Text style={styles.bodyText}>
          {challenge.scenarioDescription ||
            'Una app guarda datos sensibles en el dispositivo. Encuentra dónde y cómo.'}
        </Text>

        {ScenarioComponent ? (
          <ScenarioComponent />
        ) : (
          <View style={styles.notReadyBox}>
            <Ionicons name="construct" size={16} color={colors.textSecondary} />
            <Text style={styles.notReadyText}>
              Scenario en construcción. Próximamente disponible.
            </Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>// pistas de ataque</Text>
        {(challenge.hints || ['Sin pistas aún para este módulo']).map((hint, i) => (
          <View key={i} style={styles.hintRow}>
            <Text style={styles.hintIndex}>{i + 1}</Text>
            <Text style={styles.hintText}>{hint}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// ─── Tab: Validate ────────────────────────────────────────────
function ValidateTab({ challenge, onComplete }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  function handleValidate() {
    const answer = (challenge.flag || '').trim();
    if (answer && input.trim().includes(answer)) {
      setResult('correct');
      setShowConfetti(true);
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
            'Pega aquí el dato sensible que extrajiste del dispositivo.'}
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

        {showConfetti && (
          <ConfettiCannon
            count={150}
            origin={{ x: -10, y: 0 }}
            autoStart={true}
            fadeOut={true}
            colors={[
              colors.primary,
              colors.accent,
              colors.info,
              colors.danger,
              '#ffffff',
            ]}
          />
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
        <CodeBlock code={challenge.vulnCode || '// pendiente'} />

        <Text style={styles.sectionTitle}>// fix correcto</Text>
        <CodeBlock code={challenge.fixCode || '// pendiente'} />

        <Text style={styles.sectionTitle}>// ¿por qué funciona?</Text>
        <Text style={styles.bodyText}>
          {challenge.fixExplanation || 'Pendiente de documentar.'}
        </Text>

        <Text style={styles.sectionTitle}>// reglas generales</Text>
        {(challenge.rules || []).map((rule, i) => (
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
  const [showConfetti, setShowConfetti] = useState(false);

  const tabs = [
    { key: 'info', label: 'Info', locked: false },
    { key: 'scenario', label: 'Scenario', locked: false },
    { key: 'validate', label: 'Validate', locked: false },
    { key: 'fix', label: 'Fix', locked: !completed },
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

      {activeTab === 'info' && <InfoTab challenge={challenge} />}
      {activeTab === 'scenario' && <ScenarioTab challenge={challenge} />}
      {activeTab === 'validate' && (
        <ValidateTab
          challenge={challenge}
          onComplete={() => {
            setCompleted(true);
            setShowConfetti(true);
            setActiveTab('fix');
          }}
        />
      )}
      {activeTab === 'fix' && <FixTab challenge={challenge} />}

      {showConfetti && (
        <ConfettiCannon
          count={150}
          origin={{ x: -10, y: 0 }}
          autoStart={true}
          fadeOut={true}
          colors={[
            colors.primary,
            colors.accent,
            colors.info,
            colors.danger,
            '#ffffff',
          ]}
        />
      )}
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
  notReadyBox: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginVertical: 8,
  },
  notReadyText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 13,
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
});