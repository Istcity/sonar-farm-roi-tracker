import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Alert, FlatList, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CostEntryModal } from "../../components/forms/CostEntryModal";
import { AppCard } from "../../components/ui/AppCard";
import { AppChip } from "../../components/ui/AppChip";
import { AppText } from "../../components/ui/AppText";
import { CostListItem } from "../../features/finance/CostListItem";
import { MarketBoardCard } from "../../features/market/MarketBoardCard";
import { formatCurrency } from "../../lib/formatters";
import { recommendSuitableCrops } from "../../services/recommendationService";
import { useAgroStore } from "../../store/useAgroStore";
import { defaultExpenseCategories, useTarimStore } from "../../store/useTarimStore";
import { useThemeStore } from "../../store/useThemeStore";
import { brand } from "../../theme/palettes";
import { SCREEN_GUTTER } from "../../theme/layout";

export const CostsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const costs = useTarimStore((s) => s.costs);
  const themeName = useThemeStore((s) => s.themeName);
  const locale = useThemeStore((s) => s.locale);
  const isTR = locale.startsWith("tr");
  const climate = themeName === "continental" ? "continental" : themeName === "arid" ? "arid" : "tropical";
  const preferences = useAgroStore((s) => s.preferences);
  const deleteCost = useTarimStore((s) => s.deleteCost);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [modalVisible, setModalVisible] = useState(false);

  const gutter = {
    paddingLeft: SCREEN_GUTTER + insets.left,
    paddingRight: SCREEN_GUTTER + insets.right,
  };

  const filtered = useMemo(
    () => (selectedFilter === "all" ? costs : costs.filter((c) => c.category === selectedFilter)),
    [costs, selectedFilter],
  );
  const total = useMemo(() => filtered.reduce((sum, item) => sum + item.amount, 0), [filtered]);
  const recommendedIds = useMemo(
    () => recommendSuitableCrops({ climate, preferences }).slice(0, 4).map((c) => c.id),
    [climate, preferences],
  );

  const fabBottom = tabBarHeight + SCREEN_GUTTER;

  return (
    <View className="flex-1" style={{ backgroundColor: brand.bgLight }}>
      <View
        style={{
          backgroundColor: brand.deepBlue,
          paddingTop: insets.top + SCREEN_GUTTER,
          paddingBottom: SCREEN_GUTTER,
          ...gutter,
        }}
      >
        <AppText variant="displayMd" style={{ color: brand.white }} numberOfLines={2}>
          {isTR ? "Maliyetler" : "Costs"}
        </AppText>
      </View>

      <View className="flex-1 pt-4 gap-3" style={gutter}>
        <MarketBoardCard cropIds={recommendedIds} currency={preferences.selectedCurrency} />
        <View className="flex-row gap-3">
          <AppCard className="flex-1 min-w-0" white>
            <AppText variant="caption" numberOfLines={1}>
              {isTR ? "Toplam gider" : "Total expense"}
            </AppText>
            <AppText variant="displayMd" color="teal" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
              {formatCurrency(total)}
            </AppText>
          </AppCard>
          <AppCard className="flex-1 min-w-0" white>
            <AppText variant="caption" numberOfLines={1}>
              {isTR ? "Gider sayısı" : "Entry count"}
            </AppText>
            <AppText variant="displayMd" color="teal">
              {filtered.length}
            </AppText>
          </AppCard>
        </View>

        <View className="flex-row flex-wrap gap-2">
          <AppChip
            label={isTR ? "Tümü" : "All"}
            selected={selectedFilter === "all"}
            onPress={() => setSelectedFilter("all")}
          />
          {defaultExpenseCategories.map((category) => (
            <AppChip
              key={category}
              label={category}
              selected={selectedFilter === category}
              onPress={() => setSelectedFilter(category)}
            />
          ))}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: fabBottom + 72, gap: 8 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CostListItem
              item={item}
              onDelete={(id) =>
                Alert.alert(
                  isTR ? "Sil" : "Delete",
                  isTR ? "Bu gider silinsin mi?" : "Delete this expense?",
                  [
                    { text: isTR ? "İptal" : "Cancel" },
                    {
                      text: isTR ? "Sil" : "Delete",
                      style: "destructive",
                      onPress: () => deleteCost(id),
                    },
                  ],
                )
              }
            />
          )}
        />
      </View>

      <Pressable
        className="absolute h-14 w-14 rounded-full items-center justify-center"
        style={{
          backgroundColor: brand.teal,
          shadowColor: brand.deepBlue,
          shadowOpacity: 0.2,
          shadowRadius: 10,
          elevation: 3,
          right: SCREEN_GUTTER + insets.right,
          bottom: fabBottom,
        }}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={28} color="white" />
      </Pressable>

      <CostEntryModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
};
