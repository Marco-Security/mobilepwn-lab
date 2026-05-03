import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import BankAppShell from '../components/BankAppShell';

/**
 * M1 — AsyncStorage Inseguro
 *
 * Scenario: AnclaBank guarda el JWT de sesión en AsyncStorage al hacer login.
 * El aprendiz debe extraer el token desde fuera de la app usando ADB.
 *
 * Vulnerabilidad: AsyncStorage almacena en SQLite sin cifrar (RKStorage),
 * accesible vía `adb run-as` en builds debuggable o con root.
 */

/**
 * Construye un JWT de demostración en runtime.
 *
 * Un JWT real tiene tres partes separadas por puntos:
 *   header.payload.signature
 *
 * Header y payload son JSON codificados en Base64.
 * En esta demo la firma es un placeholder porque no validamos contra servidor.
 *
 * Se genera dinámicamente para que el token NO aparezca como string literal
 * en el bundle JS al hacer análisis estático con `strings` o jadx.
 */
function buildSessionToken(username) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      user: username,
      role: username === 'admin' ? 'superuser' : 'user',
      balance: 99999,
      iat: Date.now(),
    })
  );
  return `${header}.${payload}.DEMO_SIGNATURE`;
}

export default function M1AsyncStorageScenario() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');

  async function handleLogin() {
    if (user !== 'admin' || pass !== 'admin123') {
      setMessage('Credenciales incorrectas. Prueba con las credenciales de prueba.');
      return;
    }

    try {
      // VULNERABILIDAD INTENCIONAL: AsyncStorage guarda en texto plano.
      // El JWT queda accesible desde fuera con `adb run-as`.
      const token = buildSessionToken(user);
      await AsyncStorage.setItem('bank_auth_token', token);
      await AsyncStorage.setItem(
        'bank_user_data',
        JSON.stringify({
          user: 'admin',
          role: 'superuser',
          balance: 99999,
          session_started: new Date().toISOString(),
        })
      );
      setLoggedIn(true);
      setMessage('');
    } catch (e) {
      setMessage('Error al guardar la sesión: ' + e.message);
    }
  }

  if (loggedIn) {
    return (
      <BankAppShell subtitle="Sesión activa">
        <Text style={styles.welcome}>Bienvenido, admin</Text>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo disponible</Text>
          <Text style={styles.balanceAmount}>$99,999.00</Text>
        </View>
        <View style={styles.alertBox}>
          <Ionicons name="information-circle" size={14} color={colors.info} />
          <Text style={styles.alertText}>
            Sesión iniciada. Tu token de sesión ha sido guardado en el dispositivo.
          </Text>
        </View>
      </BankAppShell>
    );
  }

  return (
    <BankAppShell subtitle="Inicia sesión para continuar">
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        placeholderTextColor={colors.textSecondary}
        value={user}
        onChangeText={setUser}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor={colors.textSecondary}
        value={pass}
        onChangeText={setPass}
        secureTextEntry
      />

      {message !== '' && <Text style={styles.error}>{message}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      <Text style={styles.hint}>
        Credenciales de prueba disponibles en el briefing
      </Text>
    </BankAppShell>
  );
}

const styles = StyleSheet.create({
  welcome: {
    color: colors.primary,
    fontFamily: 'monospace',
    fontSize: 14,
    textAlign: 'center',
  },
  balanceCard: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  balanceLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  balanceAmount: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  alertBox: {
    flexDirection: 'row',
    gap: 8,
    padding: 10,
    backgroundColor: colors.card,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.info,
    alignItems: 'flex-start',
  },
  alertText: {
    flex: 1,
    color: colors.info,
    fontSize: 12,
    lineHeight: 18,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 12,
    color: colors.textPrimary,
    fontFamily: 'monospace',
    fontSize: 13,
  },
  error: {
    color: colors.danger,
    fontSize: 12,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.background,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    fontSize: 14,
  },
  hint: {
    color: colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
});