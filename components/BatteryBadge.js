import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * 画面下部に表示するバッテリー情報バッジ
 */
export function BatteryBadge({ isCharging, batteryLevel }) {
  const levelText = batteryLevel < 0 ? '--' : `${Math.round(batteryLevel * 100)}%`;

  return (
    <View style={styles.badge}>
      <Text style={styles.icon}>{isCharging ? '⚡' : '🔋'}</Text>
      <Text style={styles.level}>{levelText}</Text>
      {isCharging && <Text style={styles.label}>Charging Now</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    // iOS のぼかし効果は expo-blur で追加可能
  },
  icon: {
    fontSize: 18,
  },
  level: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500',
  },
  label: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
});
