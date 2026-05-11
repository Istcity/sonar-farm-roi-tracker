import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, View } from "react-native";
import { formatCategoryLabel, formatCurrency, formatDate } from "../../lib/formatters";
import { CostItem } from "../../types/store";
import { AppText } from "../../components/ui/AppText";
import { brand } from "../../theme/palettes";

type Props = { item: CostItem; onDelete?: (id: string) => void };

export const CostListItem: React.FC<Props> = ({ item, onDelete }) => (
  <View
    className="flex-row items-center justify-between rounded-xl border p-3 gap-2"
    style={{
      borderColor: "rgba(57,255,142,0.28)",
      backgroundColor: "rgba(255,255,255,0.05)",
    }}
  >
    <View className="flex-1 min-w-0 pr-2">
      <AppText variant="titleMd" numberOfLines={2}>
        {formatCategoryLabel(item.category)}
      </AppText>
      <AppText variant="caption" numberOfLines={1}>
        {formatDate(item.date)}
      </AppText>
    </View>
    <View className="flex-row items-center gap-2 flex-shrink-0">
      <AppText variant="titleMd" color="teal" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
        {formatCurrency(item.amount)}
      </AppText>
      {onDelete ? (
        <Pressable onPress={() => onDelete(item.id)} hitSlop={8}>
          <Ionicons name="trash-outline" size={18} color={brand.error} />
        </Pressable>
      ) : null}
    </View>
  </View>
);
