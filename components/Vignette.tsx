import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const CLEAR = 'rgba(0,0,0,0)';

export default function Vignette({ intensity = 1 }: { intensity?: number }) {
  const alpha = Math.min(0.85, 0.5 * intensity);
  const edge = `rgba(0,0,0,${alpha})`;
  const vSize = `${Math.round(18 * Math.min(1.3, Math.max(0.6, intensity)))}%`;
  const hSize = `${Math.round(14 * Math.min(1.3, Math.max(0.6, intensity)))}%`;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={[edge, CLEAR]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.edge, { top: 0, left: 0, right: 0, height: vSize }]}
      />
      <LinearGradient
        colors={[CLEAR, edge]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.edge, { bottom: 0, left: 0, right: 0, height: vSize }]}
      />
      <LinearGradient
        colors={[edge, CLEAR]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.edge, { top: 0, bottom: 0, left: 0, width: hSize }]}
      />
      <LinearGradient
        colors={[CLEAR, edge]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.edge, { top: 0, bottom: 0, right: 0, width: hSize }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  edge: {
    position: 'absolute',
  },
});
