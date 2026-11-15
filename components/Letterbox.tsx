import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function Letterbox() {
  return (
    <>
      <View style={[styles.bar, { top: 0 }]} pointerEvents="none" />
      <View style={[styles.bar, { bottom: 0 }]} pointerEvents="none" />
    </>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '7%',
    backgroundColor: '#000',
  },
});
