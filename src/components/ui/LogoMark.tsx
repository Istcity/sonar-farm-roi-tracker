import React from "react";
import { Image, View, ViewStyle } from "react-native";
import { brand } from "../../theme/palettes";

type Props = {
  /** Outer diameter of the circular badge (px). */
  size: number;
  /** Fill behind the image inside the circle. Defaults to white so the badge stays consistent everywhere. */
  backgroundColor?: string;
  /** Optional thin halo ring around the badge for use on dark hero / splash backgrounds. */
  ring?: boolean;
  style?: ViewStyle;
};

/**
 * Brand mark — always rendered as a white circular badge containing the pre-masked
 * round logo asset. Centralized so splash, header, about, and loading states all
 * stay visually identical.
 */
export const LogoMark: React.FC<Props> = ({
  size,
  backgroundColor = brand.white,
  ring = false,
  style,
}) => {
  const r = size / 2;
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: r,
          overflow: "hidden",
          backgroundColor,
          ...(ring
            ? {
                borderWidth: Math.max(1, size * 0.025),
                borderColor: "rgba(255,255,255,0.55)",
                shadowColor: "#000",
                shadowOpacity: 0.25,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 4 },
              }
            : null),
        },
        style,
      ]}
    >
      <Image
        source={require("../../../assets/sonaryenilogo-round.png")}
        style={{ width: size, height: size }}
        resizeMode="cover"
      />
    </View>
  );
};
