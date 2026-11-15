import React, { useMemo, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';

const SPECK_COUNT = 140;

export default function Grain({ opacity }: { opacity: number }) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
  };

  const specks = useMemo(() => {
    if (size.width === 0 || size.height === 0) return [];
    return Array.from({ length: SPECK_COUNT }, (_, i) => {
      const dotSize = 1 + Math.random() * 1.6;
      return {
        key: i,
        left: Math.random() * size.width,
        top: Math.random() * size.height,
        size: dotSize,
        shade: Math.random() > 0.5 ? '#fff' : '#000',
        speckOpacity: 0.25 + Math.random() * 0.5,
      };
    });
  }, [size.width, size.height]);

  return (
    <View style={[StyleSheet.absoluteFill, { opacity }]} pointerEvents="none" onLayout={onLayout}>
      {opacity > 0 &&
        specks.map((s) => (
          <View
            key={s.key}
            style={{
              position: 'absolute',
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              backgroundColor: s.shade,
              opacity: s.speckOpacity,
              borderRadius: s.size,
            }}
          />
        ))}
    </View>
  );
}
