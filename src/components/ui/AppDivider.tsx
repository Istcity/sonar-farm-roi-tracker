import React from "react";
import { View } from "react-native";
import { brand } from "../../theme/palettes";

export const AppDivider: React.FC = () => (
  <View className="h-px w-full" style={{ backgroundColor: brand.border }} />
);
