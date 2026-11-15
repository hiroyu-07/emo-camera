import React, { useMemo, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import type { FilterFunction } from 'react-native';
import { Canvas, Image as SkiaImage, ColorMatrix, useImage } from '@shopify/react-native-skia';
import { buildSkiaColorMatrix } from '../lib/colorMatrix';

/**
 * Renders a captured photo with the preset's color-grading filter actually applied,
 * via Skia's pixel-level ColorMatrix — RN's `filter` style prop doesn't render on
 * Image/CameraView in this RN version, so this is the reliable alternative.
 */
export default function FilteredPhoto({
  uri,
  filter,
}: {
  uri: string;
  filter: readonly FilterFunction[];
}) {
  const image = useImage(uri);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
  };

  const matrix = useMemo(() => buildSkiaColorMatrix(filter), [filter]);

  return (
    <View style={StyleSheet.absoluteFill} onLayout={onLayout}>
      {image && size.width > 0 && size.height > 0 && (
        <Canvas style={StyleSheet.absoluteFill}>
          <SkiaImage image={image} x={0} y={0} width={size.width} height={size.height} fit="cover">
            <ColorMatrix matrix={matrix} />
          </SkiaImage>
        </Canvas>
      )}
    </View>
  );
}
