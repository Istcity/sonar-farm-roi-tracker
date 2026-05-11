import Constants from "expo-constants";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { brand } from "../../theme/palettes";
import { SCREEN_GUTTER } from "../../theme/layout";
import { AppText } from "./AppText";

export const BannerAdSlot: React.FC = () => {
  const insets = useSafeAreaInsets();
  const isExpoGo = Constants.appOwnership === "expo";
  const adsModule = !isExpoGo
    ? (require("react-native-google-mobile-ads") as typeof import("react-native-google-mobile-ads"))
    : null;

  const BannerAd = adsModule?.BannerAd;
  const BannerAdSize = adsModule?.BannerAdSize;
  const TestIds = adsModule?.TestIds;

  return (
    <View
      className="absolute bottom-2 left-3 right-3 pt-2 rounded-2xl"
      style={{
        backgroundColor: "rgba(8,24,39,0.94)",
        borderColor: "rgba(94,234,212,0.32)",
        borderWidth: 1,
        shadowColor: brand.teal,
        shadowOpacity: 0.28,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 4 },
        elevation: 10,
        paddingLeft: SCREEN_GUTTER + insets.left,
        paddingRight: SCREEN_GUTTER + insets.right,
        paddingBottom: 8,
      }}
    >
      <AppText variant="caption" className="text-center mb-1" style={{ color: brand.neonMint }}>
        Destekli İçerik
      </AppText>
      {isExpoGo ? (
        <View className="h-[50px] items-center justify-center px-1 rounded-xl" style={{ backgroundColor: "rgba(94,234,212,0.12)" }}>
          <AppText variant="bodyMd" style={{ color: brand.tealLight }} numberOfLines={2} className="text-center">
            AdMob Reklam Alanı (Expo Go Mock)
          </AppText>
        </View>
      ) : BannerAd && BannerAdSize && TestIds ? (
        <BannerAd
          unitId={TestIds.BANNER}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        />
      ) : null}
    </View>
  );
};
