import React from "react";
import { StyleProp, Text, TextProps, TextStyle } from "react-native";
import { BrandColor, brand } from "../../theme/palettes";
import { TypographyVariant, typography } from "../../theme/typography";

type AppTextProps = TextProps & {
  variant?: TypographyVariant;
  color?: BrandColor;
  className?: string;
  style?: StyleProp<TextStyle>;
};

export const AppText: React.FC<AppTextProps> = ({
  variant = "bodyMd",
  color,
  className,
  style,
  children,
  ...props
}) => {
  // Explicit `color` prop always wins. Without it, caption falls back to muted
  // (secondary text on dark surfaces) and everything else to the high-contrast
  // foreground. Callers on light surfaces should pass an explicit dark color.
  const resolvedColor = color
    ? brand[color]
    : variant === "caption"
      ? brand.textMuted
      : brand.textDark;

  return (
    <Text
      {...props}
      className={className}
      style={[
        typography[variant],
        {
          color: resolvedColor,
          textTransform: variant === "label" ? "uppercase" : "none",
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};
