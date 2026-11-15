import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import CameraScreen from './screens/CameraScreen';
import PreviewScreen from './screens/PreviewScreen';
import PaywallScreen from './screens/PaywallScreen';
import { usePremiumStore } from './store/usePremiumStore';
import type { FilterPreset } from './lib/filters';

type Shot = { uri: string; preset: FilterPreset; capturedAt: Date };

export default function App() {
  const [shot, setShot] = useState<Shot | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const isPremium = usePremiumStore((s) => s.isPremium);
  const initRevenueCat = usePremiumStore((s) => s.initRevenueCat);

  useEffect(() => {
    initRevenueCat();
  }, [initRevenueCat]);

  if (showPaywall) {
    return <PaywallScreen onClose={() => setShowPaywall(false)} />;
  }

  return (
    <>
      <StatusBar style="light" />
      {shot ? (
        <PreviewScreen
          uri={shot.uri}
          preset={shot.preset}
          capturedAt={shot.capturedAt}
          isPremium={isPremium}
          onRetake={() => setShot(null)}
          onSaved={() => setShot(null)}
          onRequirePremium={() => setShowPaywall(true)}
        />
      ) : (
        <CameraScreen
          onCaptured={(uri, preset) => setShot({ uri, preset, capturedAt: new Date() })}
        />
      )}
    </>
  );
}
