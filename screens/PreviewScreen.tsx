import React, { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import ViewShot, { type ViewShotRef } from 'react-native-view-shot';
import { Asset, usePermissions } from 'expo-media-library';
import * as Haptics from 'expo-haptics';
import type { FilterPreset } from '../lib/filters';
import FilterLayer from '../components/FilterLayer';
import FilteredPhoto from '../components/FilteredPhoto';

export default function PreviewScreen({
  uri,
  preset,
  capturedAt,
  isPremium,
  onRetake,
  onSaved,
  onRequirePremium,
}: {
  uri: string;
  preset: FilterPreset;
  capturedAt: Date;
  isPremium: boolean;
  onRetake: () => void;
  onSaved: () => void;
  onRequirePremium: () => void;
}) {
  const [permission, requestPermission] = usePermissions({ writeOnly: true });
  const [saving, setSaving] = useState(false);
  const shotRef = useRef<ViewShotRef>(null);

  const handleSave = async () => {
    if (saving) return;
    if (!isPremium) {
      onRequirePremium();
      return;
    }
    setSaving(true);
    try {
      let granted = permission?.granted;
      if (!granted) {
        const res = await requestPermission();
        granted = res.granted;
      }
      if (!granted) {
        Alert.alert('保存できません', 'フォトライブラリへのアクセスが許可されていません。');
        return;
      }
      const flattenedUri = await shotRef.current?.capture?.();
      if (!flattenedUri) throw new Error('capture failed');
      await Asset.create(flattenedUri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onSaved();
    } catch (e) {
      Alert.alert('保存に失敗しました', String(e instanceof Error ? e.message : e));
    } finally {
      setSaving(false);
    }
  };

  const isFramed = preset.frame !== 'none';

  return (
    <View style={styles.container}>
      <ViewShot ref={shotRef} style={styles.shot} options={{ format: 'jpg', quality: 0.95 }}>
        {isFramed ? (
          <View style={styles.frameOuter}>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: preset.frame === 'polaroid' ? '#f5f1e8' : '#ffffff',
                  paddingBottom: preset.frame === 'polaroid' ? 60 : 24,
                },
              ]}
            >
              <View
                style={[
                  styles.photoArea,
                  { aspectRatio: preset.frame === 'polaroid' ? 1 : 0.8 },
                ]}
              >
                <FilteredPhoto uri={uri} filter={preset.filter} />
                <FilterLayer preset={preset} date={capturedAt} />
              </View>
            </View>
          </View>
        ) : (
          <>
            <FilteredPhoto uri={uri} filter={preset.filter} />
            <FilterLayer preset={preset} date={capturedAt} />
          </>
        )}
      </ViewShot>

      <View style={styles.bottomBar}>
        <Pressable style={styles.secondaryButton} onPress={onRetake} disabled={saving}>
          <Text style={styles.secondaryLabel}>撮り直す</Text>
        </Pressable>
        <Pressable style={styles.primaryButton} onPress={handleSave} disabled={saving}>
          <Text style={styles.primaryLabel}>
            {saving ? '保存中…' : isPremium ? '保存する' : '🔒 保存する(Pro)'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  shot: {
    flex: 1,
  },
  frameOuter: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '86%',
    borderRadius: 4,
    paddingTop: 14,
    paddingHorizontal: 14,
  },
  photoArea: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#111',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  secondaryButton: {
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  secondaryLabel: {
    color: '#fff',
    fontWeight: '600',
  },
  primaryButton: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 24,
    backgroundColor: '#ff8a3d',
  },
  primaryLabel: {
    color: '#1a1008',
    fontWeight: '700',
  },
});
