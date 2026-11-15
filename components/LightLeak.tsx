import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LightLeak() {
  return (
    <LinearGradient
      colors={['rgba(255,190,100,0.55)', 'rgba(255,110,170,0.25)', 'rgba(255,255,255,0)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.blob}
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    top: '-15%',
    right: '-20%',
    width: '75%',
    height: '55%',
    borderBottomLeftRadius: 400,
    mixBlendMode: 'screen',
  },
});
