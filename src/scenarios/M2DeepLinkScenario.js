import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import BankAppShell from '../components/BankAppShell';

export default function M2DeepLinkScenario() {
    const [linkSent, setLinkSent] = useState(false);

    async function handleGenerateLink() {
        setLinkSent(true);
    }

    return(
    <BankAppShell subtitle="Acceso rápido.">
        <Text style={styles.description}>
            Genera un link de acceso rápido para abrir tu sesión en otros dispositivos 
            donde ya iniciaste sesión.
        </Text>
        {linkSent ? (
        <View style={styles.alertBox}>
          <Ionicons name="information-circle" size={14} color={colors.primary} />
          <Text style={styles.alertText}>
            Link enviado a tu sesión vinculada en otro dispositivo. Expira en: 5 minutos
          </Text>
        </View>
        ) : (
        <TouchableOpacity style={styles.button} onPress={handleGenerateLink}>
            <Text style={styles.buttonText}>Generar link de acceso rápido</Text>
        </TouchableOpacity>
        )}
    </BankAppShell>
    )
}

const styles = StyleSheet.create({
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
    alertBox: {
        flexDirection: 'row',
        gap: 8,
        padding: 10,
        backgroundColor: colors.card,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.primary,
        alignItems: 'flex-start',
    },
    alertText: {
        flex: 1,
        color: colors.primary,
        fontSize: 12,
        lineHeight: 18,
    },
    description: {
        color: colors.textSecondary,
        fontSize: 13,
        lineHeight: 20,
    },
})