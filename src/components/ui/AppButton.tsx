import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { brand } from "../../theme/palettes";
import { AppText } from "./AppText";

type Variant = "primary" | "secondary" | "destructive";
type Props = TouchableOpacityProps & {
  title: string;
  variant?: Variant;
  className?: string;
};

export const AppButton: React.FC<Props> = ({
  title,
  variant = "primary",
  className,
  style,
  ...props
}) => {
  const bg =
    variant === "primary" ? brand.neonGreen : variant === "destructive" ? brand.error : "rgba(17,179,135,0.16)";
  const color = variant === "secondary" ? brand.neonMint : brand.white;
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.82}
      className={`rounded-2xl py-3.5 px-4 items-center justify-center border ${className || ""}`}
      style={[
        {
          backgroundColor: bg,
          borderColor: variant === "secondary" ? "rgba(57,255,142,0.45)" : bg,
          shadowColor: variant === "secondary" ? brand.neonMint : brand.neonGreen,
          shadowOpacity: variant === "secondary" ? 0.12 : 0.28,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 4 },
          elevation: variant === "secondary" ? 2 : 5,
        },
        style,
      ]}
    >
      <AppText variant="titleMd" style={{ fontSize: 15, color: variant === "primary" ? brand.deepBlue : color }}>
        {title}
      </AppText>
    </TouchableOpacity>
  );
};
