import React from "react";
import { Platform, View, ViewProps } from "react-native";
import { brand } from "../../theme/palettes";

type Props = ViewProps & {
  className?: string;
  white?: boolean;
};

export const AppCard: React.FC<Props> = ({ className, white, style, children, ...props }) => {
  return (
    <View
      {...props}
      className={`rounded-3xl p-4 border ${className || ""}`}
      style={[
        {
          backgroundColor: white ? "rgba(20,44,54,0.98)" : "rgba(14,39,50,0.94)",
          borderColor: "rgba(57,255,142,0.28)",
          shadowColor: brand.neonGreen,
          shadowOpacity: 0.24,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 8 },
          elevation: Platform.OS === "android" ? 6 : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};
