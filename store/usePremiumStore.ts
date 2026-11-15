import { create } from 'zustand';
import Purchases, { LOG_LEVEL, type PurchasesOffering, type PurchasesPackage } from 'react-native-purchases';
import { Platform } from 'react-native';

// RevenueCat API キー（emo-camera 専用プロジェクト）
const RC_IOS_KEY = 'appl_XWkEXbqECRKQLVtZDUcNpqlqyjc';
// Android用アプリはRevenueCatでまだ未設定。設定したらここを差し替える。
const RC_ANDROID_KEY = 'appl_XWkEXbqECRKQLVtZDUcNpqlqyjc';

// RevenueCat ダッシュボードのエンタイトルメント識別子
export const PREMIUM_ENTITLEMENT_ID = 'emo_camera_pro';

interface PremiumStore {
  isPremium: boolean;
  isLoading: boolean;
  offering: PurchasesOffering | null;
  initRevenueCat: () => Promise<void>;
  refresh: () => Promise<void>;
  purchasePackage: (pkg: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
}

let rcInitialized = false;

export const usePremiumStore = create<PremiumStore>((set, get) => ({
  isPremium: false,
  isLoading: false,
  offering: null,

  initRevenueCat: async () => {
    if (rcInitialized) return;
    try {
      Purchases.setLogLevel(LOG_LEVEL.ERROR);
      const apiKey = Platform.OS === 'ios' ? RC_IOS_KEY : RC_ANDROID_KEY;
      Purchases.configure({ apiKey });
      rcInitialized = true;
      await get().refresh();
    } catch {}
  },

  refresh: async () => {
    set({ isLoading: true });
    try {
      const [info, offerings] = await Promise.all([
        Purchases.getCustomerInfo(),
        Purchases.getOfferings(),
      ]);
      set({
        isPremium: Boolean(info.entitlements.active[PREMIUM_ENTITLEMENT_ID]),
        offering: offerings.current ?? null,
      });
    } catch {
    } finally {
      set({ isLoading: false });
    }
  },

  purchasePackage: async (pkg: PurchasesPackage) => {
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      const active = Boolean(customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]);
      set({ isPremium: active });
      return active;
    } catch (e: any) {
      if (e?.userCancelled) return false;
      throw e;
    }
  },

  restorePurchases: async () => {
    try {
      const info = await Purchases.restorePurchases();
      const active = Boolean(info.entitlements.active[PREMIUM_ENTITLEMENT_ID]);
      set({ isPremium: active });
      return active;
    } catch {
      return false;
    }
  },
}));
