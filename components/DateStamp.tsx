import React from 'react';
import { Platform, StyleSheet, Text } from 'react-native';

export default function DateStamp({ date }: { date: Date }) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');

  return (
    <Text style={styles.stamp}>
      {`'${String(y).slice(2)} ${m} ${d}`}
    </Text>
  );
}

const styles = StyleSheet.create({
  stamp: {
    position: 'absolute',
    right: 18,
    bottom: 22,
    color: '#ff8a3d',
    fontSize: 16,
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
});
