import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { FilterPreset } from '../lib/filters';
import Grain from './Grain';
import Vignette from './Vignette';
import LightLeak from './LightLeak';
import DateStamp from './DateStamp';
import Letterbox from './Letterbox';

export default function FilterLayer({ preset, date }: { preset: FilterPreset; date: Date }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {preset.overlayColor !== 'transparent' && (
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: preset.overlayColor, mixBlendMode: preset.overlayBlend },
          ]}
        />
      )}
      {preset.vignette > 0 && <Vignette intensity={preset.vignette} />}
      {preset.lightLeak && <LightLeak />}
      <Grain opacity={preset.grainOpacity} />
      {preset.letterbox && <Letterbox />}
      {preset.dateStamp && <DateStamp date={date} />}
    </View>
  );
}
