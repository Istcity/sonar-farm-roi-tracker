import React from "react";
import { Pressable, PressableProps, StyleProp, ViewStyle } from "react-native";
import { brand } from "../../theme/palettes";
import { AppText } from "./AppText";

type Props = PressableProps & {
  label: string;
  selected?: boolean;
  chipStyle?: StyleProp<ViewStyle>;
  textColor?: string;
  selectedTextColor?: string;
};

export const AppChip: React.FC<Props> = ({
  label,
  selected,
  chipStyle,
  textColor,
  selectedTextColor,
  ...props
}) => {
  const resolvedDefault = textColor ?? brand.neonMint;
  const resolvedSelected = selectedTextColor ?? brand.deepBlue;
  return (
    <Pressable
      {...props}
      className="px-3.5 py-2.5 rounded-full border"
      style={[
        {
          backgroundColor: selected ? "rgba(57,255,142,0.95)" : "rgba(17,179,135,0.12)",
          borderColor: selected ? "rgba(57,255,142,0.85)" : brand.border,
          shadowColor: brand.neonGreen,
          shadowOpacity: selected ? 0.26 : 0.05,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 3 },
          elevation: selected ? 4 : 0,
        },
        chipStyle,
      ]}
    >
      <AppText variant="bodyMd" style={{ color: selected ? resolvedSelected : resolvedDefault }}>
        {label}
      </AppText>
    </Pressable>
  );
};
