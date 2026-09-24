import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

interface KPICardProps {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}

function KPICard({ label, value, sub, color = '#F3F4F6' }: KPICardProps) {
  return (
    <View style={styles.kpiCard}>
      <Text style={[styles.kpiValue, { color }]}>{value}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
      {sub ? <Text style={styles.kpiSub}>{sub}</Text> : null}
    </View>
  );
}

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      {/* Today Hero card */}
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Today's Inspections</Text>
        <Text style={styles.heroDate}>{new Date().toDateString()}</Text>
        <View style={styles.heroKPIs}>
          <View style={styles.heroMetric}>
            <Text style={styles.heroMetricValue}>0</Text>
            <Text style={styles.heroMetricLabel}>Lots Inspected</Text>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroMetric}>
            <Text style={[styles.heroMetricValue, { color: '#10B981' }]}>—</Text>
            <Text style={styles.heroMetricLabel}>Avg Grade A%</Text>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroMetric}>
            <Text style={[styles.heroMetricValue, { color: '#F59E0B' }]}>—</Text>
            <Text style={styles.heroMetricLabel}>Avg URS%</Text>
          </View>
        </View>
      </View>

      {/* KPI grid */}
      <Text style={styles.sectionTitle}>Batch Summary</Text>
      <View style={styles.kpiGrid}>
        <KPICard label="Grade A Lots" value="0" color="#10B981" />
        <KPICard label="Rejected Lots" value="0" color="#EF4444" />
        <KPICard label="Under Review" value="0" color="#F59E0B" />
        <KPICard label="Pending Sync" value="0" color="#06B6D4" />
      </View>

      {/* Recent lots placeholder */}
      <Text style={styles.sectionTitle}>Recent Lots</Text>
      <View style={styles.emptyState}>
        <Text style={styles.emptyEmoji}>🧅</Text>
        <Text style={styles.emptyTitle}>No lots yet</Text>
        <Text style={styles.emptyText}>
          Start a new capture session to begin grading onions.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B1020' },
  content: { padding: 16, gap: 16, paddingBottom: 32 },

  heroCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 20,
  },
  heroTitle: { color: '#F3F4F6', fontSize: 20, fontWeight: '700' },
  heroDate: { color: '#6B7280', fontSize: 12, marginTop: 2, marginBottom: 16 },
  heroKPIs: { flexDirection: 'row', alignItems: 'center' },
  heroMetric: { flex: 1, alignItems: 'center' },
  heroMetricValue: { color: '#F3F4F6', fontSize: 24, fontWeight: '800' },
  heroMetricLabel: { color: '#94A3B8', fontSize: 11, marginTop: 2 },
  heroDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  sectionTitle: {
    color: '#CCC3D8',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.08,
    textTransform: 'uppercase',
    marginTop: 8,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  kpiCard: {
    flex: 1,
    minWidth: '44%',
    backgroundColor: '#111827',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 16,
  },
  kpiValue: { fontSize: 28, fontWeight: '800' },
  kpiLabel: { color: '#94A3B8', fontSize: 12, marginTop: 4 },
  kpiSub: { color: '#6B7280', fontSize: 11, marginTop: 2 },

  emptyState: {
    backgroundColor: '#111827',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 32,
    alignItems: 'center',
  },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { color: '#F3F4F6', fontSize: 16, fontWeight: '600', marginBottom: 6 },
  emptyText: { color: '#94A3B8', fontSize: 13, textAlign: 'center', lineHeight: 20 },
});
