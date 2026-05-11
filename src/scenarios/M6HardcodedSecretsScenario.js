import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import BankAppShell from '../components/BankAppShell';

const DB_CONFIG = {
    host: 'db.anclabank.internal',
    port: 5432,
    database: 'anclabank_prod',
    credentials: btoa('admin:supersecret123')
}

const reports = [
        {id: '1', title: 'Reporte Q1 2026', date: '2026-01-31'},
        {id: '2', title: 'Reporte Q2 2026', date: '2025-12-31'},
    ]

export default function M6HardcodedSecretsScenario() {
    const [connected, setConnected] = useState(false)

    async function handleGenerateCredentials() {
        setConnected(true);
        
    }

    return(
        <BankAppShell subtitle="Reportes Internos">
            {reports.map((report) => (
                <View key={report.id} style={styles.reportCard}>
                    <Text style={styles.reportTitle}>{report.title}</Text>
                    <Text style={styles.reportDate}>Generado: {report.date}</Text>
                    <Text style={styles.reportStatus}>Estado: Disponible</Text>
                </View>
            ))}
            {connected ? (
                <View style={styles.alertBox}>
                    <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
                    <Text style={styles.alertText}>
                        Conectado a db.anclabank.internal Base de datos: anclabank_prod 
                        Tablas disponibles: usuarios, transacciones, reportes
                    </Text>
                </View>
                ) : (
                <TouchableOpacity style={styles.button} onPress={handleGenerateCredentials}>
                    <Text style={styles.buttonText}>Conectar a base de datos</Text>
                </TouchableOpacity>
                )}
        </BankAppShell>
    )
}

const styles = StyleSheet.create({
    reportCard: {
        backgroundColor: colors.card,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 12,
        gap: 4,
    },
    reportTitle: {
        color: colors.textPrimary,
        fontSize: 14,
        fontWeight: 'bold'
    },
    reportDate: {
        color: colors.textSecondary,
        fontSize: 12,
    },
    reportStatus: {
        color: colors.primary,
        fontSize: 12,
        fontFamily: 'monospace',
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
     button: {
        backgroundColor: colors.primary,
        borderRadius: 6,
        padding: 12,
        alignItems: 'center',
    },
    alertText: {
        flex: 1,
        color: colors.primary,
        fontSize: 12,
        lineHeight: 18,
    },
    buttonText: {
        color: colors.background,
        fontWeight: 'bold',
        fontFamily: 'monospace',
        fontSize: 14,
    },
})