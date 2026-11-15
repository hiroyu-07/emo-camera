import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions, type CameraType, type FlashMode } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { FILTERS, type FilterPreset } from '../lib/filters';
import FilterLayer from '../components/FilterLayer';
import FilterStrip from '../components/FilterStrip';

export default function CameraScreen({
  onCaptured,
}: {
  onCaptured: (uri: string, preset: FilterPreset) => void;
}) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [preset, setPreset] = useState<FilterPreset>(FILTERS[1]);
  const cameraRef = useRef<CameraView>(null);
  const [ready, setReady] = useState(false);

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>カメラへのアクセスを許可してください</Text>
        <Pressable style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonLabel}>許可する</Text>
        </Pressable>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current || !ready) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
    if (photo?.uri) onCaptured(photo.uri, preset);
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={[StyleSheet.absoluteFill, { filter: preset.filter }]}
        facing={facing}
        flash={flash}
        onCameraReady={() => setReady(true)}
      />
      <FilterLayer preset={preset} date={new Date()} />

      <View style={styles.topBar}>
        <Pressable
          style={styles.iconButton}
          onPress={() => setFlash((f) => (f === 'off' ? 'on' : 'off'))}
        >
          <Text style={styles.iconText}>{flash === 'off' ? '⚡︎off' : '⚡︎on'}</Text>
        </Pressable>
        <Pressable
          style={styles.iconButton}
          onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
        >
          <Text style={styles.iconText}>反転</Text>
        </Pressable>
      </View>

      <View style={styles.bottomBar}>
        <FilterStrip selectedId={preset.id} onSelect={setPreset} />
        <Pressable style={styles.shutterOuter} onPress={takePicture}>
          <View style={styles.shutterInner} />
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
  permissionContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
  },
  permissionText: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#ff8a3d',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  permissionButtonLabel: {
    color: '#1a1008',
    fontWeight: '700',
  },
  topBar: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    paddingHorizontal: 16,
  },
  iconButton: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  iconText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 36,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 18,
  },
  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
});
