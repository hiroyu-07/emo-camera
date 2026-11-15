import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { FILTERS, type FilterPreset } from '../lib/filters';

export default function FilterStrip({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (preset: FilterPreset) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.strip}
      contentContainerStyle={styles.content}
    >
      {FILTERS.map((f) => {
        const active = f.id === selectedId;
        return (
          <Pressable
            key={f.id}
            onPress={() => onSelect(f)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{f.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  strip: {
    maxHeight: 56,
  },
  content: {
    paddingHorizontal: 16,
    gap: 10,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  chipActive: {
    backgroundColor: '#ff8a3d',
  },
  label: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  labelActive: {
    color: '#1a1008',
  },
});
