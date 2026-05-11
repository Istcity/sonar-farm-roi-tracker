import React, { useMemo, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { globalCropGroups, globalCropLibrary, LibraryCrop } from "../../data/globalCropLibrary";
import { getCountryCropInsight } from "../../lib/cropCountryInsights";
import { getUnifiedCropDetail } from "../../lib/cropLibraryDetails";
import { useThemeStore } from "../../store/useThemeStore";
import { brand } from "../../theme/palettes";
import { AppText } from "../ui/AppText";
import { AppCard } from "../ui/AppCard";
import { AppChip } from "../ui/AppChip";

type Props = {
  visible: boolean;
  onClose: () => void;
  onOpenCrop: (cropId: string) => void;
};

type SwipeableCardProps = {
  children: React.ReactNode;
  className?: string;
  onSwipeRight: () => void;
};

const SwipeableCard: React.FC<SwipeableCardProps> = ({ children, className, onSwipeRight }) => {
  const translateX = React.useRef(new Animated.Value(0)).current;

  const reset = React.useCallback(() => {
    Animated.spring(translateX, { toValue: 0, useNativeDriver: true, bounciness: 7 }).start();
  }, [translateX]);

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_evt, gesture) =>
          Math.abs(gesture.dx) > 10 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
        onPanResponderMove: (_evt, gesture) => {
          if (gesture.dx > 0) translateX.setValue(gesture.dx);
        },
        onPanResponderRelease: (_evt, gesture) => {
          if (gesture.dx > 95) {
            onSwipeRight();
            translateX.setValue(0);
            return;
          }
          reset();
        },
        onPanResponderTerminate: reset,
      }),
    [onSwipeRight, reset, translateX],
  );

  return (
    <Animated.View style={{ transform: [{ translateX }] }} {...panResponder.panHandlers}>
      <AppCard className={className}>{children}</AppCard>
    </Animated.View>
  );
};

export const CropLibraryModal: React.FC<Props> = ({ visible, onClose, onOpenCrop }) => {
  const locale = useThemeStore((s) => s.locale);
  const countryCode = useThemeStore((s) => s.countryCode);
  const isTR = locale.startsWith("tr");
  const [query, setQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [selectedCrop, setSelectedCrop] = useState<LibraryCrop | null>(null);

  const normalizedQuery = query.trim().toLocaleLowerCase();

  const filtered = useMemo(() => {
    return globalCropLibrary.filter((crop) => {
      const name = isTR ? crop.ad : crop.adEn;
      const category = isTR ? crop.kategori : crop.kategoriEn;
      const summary = isTR ? crop.ozet : crop.ozetEn;
      const groupOk = selectedGroup === "all" || crop.kategoriEn === selectedGroup;
      if (!groupOk) return false;
      if (!normalizedQuery) return true;
      return (
        name.toLocaleLowerCase().includes(normalizedQuery) ||
        category.toLocaleLowerCase().includes(normalizedQuery) ||
        summary.toLocaleLowerCase().includes(normalizedQuery)
      );
    });
  }, [isTR, normalizedQuery, selectedGroup]);

  const featured = useMemo(() => {
    if (filtered.length === 0) return null;
    const onlyDetailed = filtered.filter((item) => item.hasDetailedProfile);
    if (onlyDetailed.length === 0) return filtered[0];
    const dayIndex = new Date().getDate() % onlyDetailed.length;
    return onlyDetailed[dayIndex];
  }, [filtered]);

  const selectedDetail = useMemo(
    () => (selectedCrop ? getUnifiedCropDetail(selectedCrop, isTR) : null),
    [selectedCrop, isTR],
  );
  const countryInsight = useMemo(
    () => (selectedCrop ? getCountryCropInsight(selectedCrop, countryCode, isTR) : null),
    [selectedCrop, countryCode, isTR],
  );

  const openDetail = (cropId: string) => {
    onClose();
    onOpenCrop(cropId);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-end bg-black/55"
      >
        <Pressable className="flex-1" onPress={onClose} />
        <View
          className="max-h-[92%] rounded-t-3xl px-5 pt-5 pb-4 border-t"
          style={{ backgroundColor: brand.nightBg, borderTopColor: "rgba(57,255,142,0.28)" }}
        >
          <View className="flex-row items-center justify-between mb-2">
            <AppText variant="titleLg" className="flex-1 pr-2">
              {isTR ? "Urun Kutuphanesi" : "Crop Library"}
            </AppText>
            <Pressable onPress={onClose} hitSlop={12} accessibilityRole="button">
              <AppText variant="titleMd">✕</AppText>
            </Pressable>
          </View>

          <TextInput
            className="rounded-xl border px-3 py-3 mb-3"
            style={{
              borderColor: "rgba(57,255,142,0.35)",
              color: brand.textDark,
              backgroundColor: "rgba(255,255,255,0.04)",
            }}
            placeholder={isTR ? "Urun ara (or. domates, bugday...)" : "Search crops (e.g. tomato, wheat...)"}
            placeholderTextColor={brand.textMuted}
            value={query}
            onChangeText={setQuery}
          />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
            <View className="flex-row gap-2">
              <AppChip
                label={isTR ? "Tum Gruplar" : "All Groups"}
                selected={selectedGroup === "all"}
                textColor={brand.textDark}
                selectedTextColor={brand.deepBlue}
                onPress={() => setSelectedGroup("all")}
              />
              {globalCropGroups.map((group) => (
                <AppChip
                  key={group}
                  label={group}
                  selected={selectedGroup === group}
                  textColor={brand.textDark}
                  selectedTextColor={brand.deepBlue}
                  onPress={() => setSelectedGroup(group)}
                />
              ))}
            </View>
          </ScrollView>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {!selectedCrop && featured ? (
              <SwipeableCard className="mb-3" onSwipeRight={onClose}>
                <AppText variant="label" color="teal">
                  {isTR ? "Gunluk One Cikan Urun" : "Daily Highlight"}
                </AppText>
                <AppText variant="titleLg" className="mt-1">
                  {isTR ? featured.ad : featured.adEn}
                </AppText>
                <AppText variant="caption" className="mt-1">
                  {isTR ? featured.kategori : featured.kategoriEn}
                </AppText>
                <AppText variant="bodyMd" color="textMuted" className="mt-2">
                  {isTR ? featured.ozet : featured.ozetEn}
                </AppText>
                <Pressable onPress={() => setSelectedCrop(featured)} className="mt-3 self-start">
                  <AppText variant="bodyMd" color="teal">
                    {isTR ? "Kartta incele ›" : "Inspect card ›"} 
                  </AppText>
                </Pressable>
              </SwipeableCard>
            ) : null}

            {selectedCrop ? (
              <SwipeableCard className="mb-3" onSwipeRight={() => setSelectedCrop(null)}>
                <Pressable onPress={() => setSelectedCrop(null)} className="self-start mb-2">
                  <AppText variant="bodyMd" color="teal">
                    {isTR ? "‹ Listeye don  •  Saga kaydir" : "‹ Back to list  •  Swipe right"}
                  </AppText>
                </Pressable>
                <AppText variant="label" color="teal">
                  {isTR ? "Secilen Urun" : "Selected Crop"}
                </AppText>
                <AppText variant="titleLg" className="mt-1">
                  {isTR ? selectedCrop.ad : selectedCrop.adEn}
                </AppText>
                <AppText variant="caption" className="mt-1">
                  {(isTR ? selectedCrop.kategori : selectedCrop.kategoriEn)} · {selectedCrop.iklimler.join(", ")}
                </AppText>
                <AppText variant="bodyMd" color="textMuted" className="mt-2">
                  {isTR ? selectedCrop.ozet : selectedCrop.ozetEn}
                </AppText>
                <AppText variant="caption" className="mt-2">
                  {(isTR ? "Kullanim" : "Use cases")}: {selectedCrop.kullanim.join(", ")}
                </AppText>
                <AppText variant="caption" className="mt-1">
                  {(isTR ? "Bolge kapsami" : "Region scope")}: {selectedCrop.bolgeler.join(", ")}
                </AppText>
                {countryInsight ? (
                  <View
                    className="mt-3 rounded-xl border p-3"
                    style={{ borderColor: "rgba(57,255,142,0.28)", backgroundColor: "rgba(255,255,255,0.04)" }}
                  >
                    <AppText variant="label" color="teal">
                      {isTR ? `Ulke Bazli Ozet · ${countryInsight.countryLabel}` : `Country Snapshot · ${countryInsight.countryLabel}`}
                    </AppText>
                    <AppText variant="bodyMd" className="mt-2">
                      {countryInsight.yieldText}
                    </AppText>
                    <AppText variant="bodyMd" className="mt-1">
                      {countryInsight.priceText}
                    </AppText>
                    <AppText variant="caption" className="mt-1">
                      {countryInsight.climateLine}
                    </AppText>
                  </View>
                ) : null}

                {selectedDetail ? (
                  <View
                    className="mt-3 rounded-xl border p-3"
                    style={{ borderColor: "rgba(57,255,142,0.28)", backgroundColor: "rgba(255,255,255,0.04)" }}
                  >
                    <AppText variant="label" color="teal">
                      {isTR ? "Uretim Sartlari" : "Production Conditions"}
                    </AppText>
                    <AppText variant="caption" className="mt-2">
                      pH: {selectedDetail.ph}
                    </AppText>
                    <AppText variant="caption" className="mt-1">
                      {isTR ? "Su ihtiyaci" : "Water need"}:{" "}
                      {selectedDetail.waterNeed}
                    </AppText>
                    <AppText variant="caption" className="mt-1">
                      {isTR ? "Toprak tipleri" : "Soil types"}:{" "}
                      {selectedDetail.soilTypes.join(", ")}
                    </AppText>
                    <AppText variant="caption" className="mt-1">
                      {isTR ? "Ekim donemi" : "Sowing period"}: {selectedDetail.sowingPeriod}
                    </AppText>
                    <AppText variant="caption" className="mt-1">
                      {isTR ? "Hasat donemi" : "Harvest period"}: {selectedDetail.harvestPeriod}
                    </AppText>
                    <AppText variant="caption" className="mt-1">
                      {isTR ? "Iklim notu" : "Climate note"}: {selectedDetail.climateNote}
                    </AppText>
                  </View>
                ) : null}
                {selectedCrop.hasDetailedProfile ? (
                  <Pressable onPress={() => openDetail(selectedCrop.id)} className="mt-3 self-start">
                    <AppText variant="bodyMd" color="teal">
                      {isTR ? "Detayli analiz ekranina git ›" : "Open full analytics ›"}
                    </AppText>
                  </Pressable>
                ) : null}
                <AppText variant="caption" className="mt-3">
                  {selectedCrop.hasDetailedProfile
                    ? isTR
                      ? "Finans ve hastalik profili bu urun icin aktif. Tum metrikler detayli analiz ekraninda yer alir."
                      : "Finance and disease profile is active for this crop. Full metrics are available in the analytics screen."
                    : isTR
                      ? "Bu urun global kutuphane kaydinda. Ayrintili finans ve hastalik profili bir sonraki veri paketinde eklenecek."
                      : "This crop is currently in global-library mode. Advanced finance and disease profile will be added in the next data pack."}
                </AppText>
              </SwipeableCard>
            ) : null}

            {!selectedCrop
              ? filtered.map((crop) => (
                  <SwipeableCard key={crop.id} className="mb-2" onSwipeRight={onClose}>
                    <Pressable
                      onPress={() => {
                        setSelectedCrop(crop);
                      }}
                      accessibilityRole="button"
                    >
                      <AppText variant="titleMd">{isTR ? crop.ad : crop.adEn}</AppText>
                      <AppText variant="caption" className="mt-1">
                        {isTR ? crop.kategori : crop.kategoriEn}
                      </AppText>
                    </Pressable>
                  </SwipeableCard>
                ))
              : null}

            {!selectedCrop && filtered.length === 0 ? (
              <SwipeableCard onSwipeRight={onClose}>
                <AppText variant="bodyMd" color="textMuted">
                  {isTR ? "Aramana uygun urun bulunamadi." : "No crop found for your search."}
                </AppText>
              </SwipeableCard>
            ) : null}
            <View className="h-8" />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
