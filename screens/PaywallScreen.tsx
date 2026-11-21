import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import type { PurchasesPackage } from 'react-native-purchases';
import { usePremiumStore } from '../store/usePremiumStore';

const PRIVACY_POLICY_URL = 'https://hiroyu-07.github.io/emo-camera/privacy.html';
const TERMS_OF_USE_URL = 'https://hiroyu-07.github.io/emo-camera/terms.html';

export default function PaywallScreen({ onClose }: { onClose: () => void }) {
  const { offering, purchasePackage, restorePurchases, isLoading } = usePremiumStore();
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<PurchasesPackage | null>(null);

  const annualPackage = offering?.annual ?? null;
  const monthlyPackage = offering?.monthly ?? null;

  useEffect(() => {
    if (!selected) setSelected(annualPackage ?? monthlyPackage);
  }, [annualPackage, monthlyPackage, selected]);

  const handlePurchase = async () => {
    if (!selected || busy) return;
    setBusy(true);
    try {
      const unlocked = await purchasePackage(selected);
      if (unlocked) onClose();
    } catch (e) {
      Alert.alert('購入に失敗しました', String(e instanceof Error ? e.message : e));
    } finally {
      setBusy(false);
    }
  };

  const handleRestore = async () => {
    setBusy(true);
    try {
      const restored = await restorePurchases();
      if (restored) {
        onClose();
      } else {
        Alert.alert('復元できる購入がありません');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeLabel}>閉じる</Text>
      </Pressable>

      <View style={styles.content}>
        <Text style={styles.title}>emo-camera Pro</Text>
        <Text style={styles.subtitle}>全フィルター + 今後追加される新しいフィルムの質感を、すべて解放</Text>

        <View style={styles.features}>
          <Text style={styles.feature}>・写ルンです風、コダック風、ポラロイド等 全フィルター</Text>
          <Text style={styles.feature}>・今後配信される新フィルターを追加料金なしで利用可能</Text>
          <Text style={styles.feature}>・広告なし</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator color="#fff" style={{ marginTop: 24 }} />
        ) : annualPackage || monthlyPackage ? (
          <>
            <View style={styles.plans}>
              {annualPackage && (
                <PlanOption
                  label="年額プラン"
                  priceString={annualPackage.product.priceString}
                  period="年"
                  badge="お得"
                  active={selected?.identifier === annualPackage.identifier}
                  onPress={() => setSelected(annualPackage)}
                />
              )}
              {monthlyPackage && (
                <PlanOption
                  label="月額プラン"
                  priceString={monthlyPackage.product.priceString}
                  period="月"
                  active={selected?.identifier === monthlyPackage.identifier}
                  onPress={() => setSelected(monthlyPackage)}
                />
              )}
            </View>

            <Pressable style={styles.purchaseButton} onPress={handlePurchase} disabled={busy}>
              <Text style={styles.purchaseLabel}>
                {busy
                  ? '処理中…'
                  : selected
                    ? `${selected.product.priceString}/${selected.identifier === annualPackage?.identifier ? '年' : '月'} で始める`
                    : '始める'}
              </Text>
            </Pressable>

            <Text style={styles.disclosure}>
              購入すると{selected?.identifier === annualPackage?.identifier ? '1年ごと' : '1ヶ月ごと'}
              に自動更新されます。いつでも端末の「設定 › Apple ID › サブスクリプション」からキャンセルできます。
            </Text>
          </>
        ) : (
          <Text style={styles.feature}>
            商品情報を取得できませんでした。RevenueCatの設定を確認してください。
          </Text>
        )}

        <Pressable style={styles.restoreButton} onPress={handleRestore} disabled={busy}>
          <Text style={styles.restoreLabel}>購入を復元</Text>
        </Pressable>

        <View style={styles.legalLinks}>
          <Pressable onPress={() => Linking.openURL(TERMS_OF_USE_URL)}>
            <Text style={styles.legalLinkLabel}>利用規約</Text>
          </Pressable>
          <Text style={styles.legalLinkSeparator}>・</Text>
          <Pressable onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}>
            <Text style={styles.legalLinkLabel}>プライバシーポリシー</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function PlanOption({
  label,
  priceString,
  period,
  badge,
  active,
  onPress,
}: {
  label: string;
  priceString: string;
  period: string;
  badge?: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.plan, active && styles.planActive]} onPress={onPress}>
      <View style={styles.planHeader}>
        <Text style={styles.planLabel}>{label}</Text>
        {badge && (
          <View style={styles.planBadge}>
            <Text style={styles.planBadgeLabel}>{badge}</Text>
          </View>
        )}
      </View>
      <Text style={styles.planPrice}>
        {priceString}
        <Text style={styles.planPricePeriod}> / {period}</Text>
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  closeButton: {
    position: 'absolute',
    top: 56,
    right: 20,
    zIndex: 1,
  },
  closeLabel: {
    color: '#fff',
    fontSize: 15,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 12,
  },
  title: {
    color: '#ff8a3d',
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 22,
  },
  features: {
    marginTop: 20,
    gap: 10,
  },
  feature: {
    color: '#ddd',
    fontSize: 14,
  },
  plans: {
    marginTop: 28,
    gap: 12,
  },
  plan: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  planActive: {
    borderColor: '#ff8a3d',
    backgroundColor: 'rgba(255,138,61,0.08)',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planLabel: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  planBadge: {
    backgroundColor: '#ff8a3d',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  planBadgeLabel: {
    color: '#1a1008',
    fontSize: 11,
    fontWeight: '700',
  },
  planPrice: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  planPricePeriod: {
    color: '#999',
    fontSize: 13,
    fontWeight: '400',
  },
  disclosure: {
    color: '#888',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 12,
  },
  purchaseButton: {
    marginTop: 20,
    backgroundColor: '#ff8a3d',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
  },
  purchaseLabel: {
    color: '#1a1008',
    fontSize: 16,
    fontWeight: '700',
  },
  restoreButton: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 10,
  },
  restoreLabel: {
    color: '#aaa',
    fontSize: 13,
  },
  legalLinks: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  legalLinkLabel: {
    color: '#888',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  legalLinkSeparator: {
    color: '#555',
    fontSize: 12,
    marginHorizontal: 8,
  },
});
