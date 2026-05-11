import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { brand } from "../../theme/palettes";

type Props = {
  size?: number;
  className?: string;
  mode?: "calm" | "watch" | "alert";
  /**
   * Live wind speed in km/h. When provided, the rotor's spin speed is driven
   * directly by the wind so the animation reacts continuously instead of in
   * three discrete steps. The status pill colour also follows the same scale.
   */
  windKmh?: number;
};

/**
 * Maps a wind speed (km/h) to one full rotor revolution duration in ms.
 * Calm air ≈ 5 km/h → ~3.5 s/rev (lazy); a 60 km/h gale → ~0.4 s/rev (fast spin).
 */
const durationFromWind = (windKmh: number): number => {
  const clamped = Math.max(0, Math.min(80, windKmh));
  return Math.round(3500 - (clamped / 80) * 3100);
};

const labelFromWind = (windKmh: number, isTR: boolean = true): string => {
  if (windKmh >= 40) return isTR ? "Fırtına" : "Storm";
  if (windKmh >= 28) return isTR ? "Sert" : "Strong";
  if (windKmh >= 16) return isTR ? "Esinti" : "Breeze";
  if (windKmh >= 6) return isTR ? "Hafif" : "Light";
  return isTR ? "Sakin" : "Calm";
};

const colorFromWind = (windKmh: number): string => {
  if (windKmh >= 28) return "#FFD08A";
  if (windKmh >= 16) return "#A4F7E8";
  return brand.neonMint;
};

export const WindTurbine: React.FC<Props> = ({ size = 210, className, mode = "calm", windKmh }) => {
  const spin = useSharedValue(0);

  // Resolve duration: live wind takes precedence; otherwise fall back to mode buckets.
  const duration =
    typeof windKmh === "number"
      ? durationFromWind(windKmh)
      : mode === "alert"
        ? 900
        : mode === "watch"
          ? 1700
          : 2800;

  const haloOpacity =
    typeof windKmh === "number"
      ? Math.min(0.34, 0.12 + Math.max(0, windKmh) / 200)
      : mode === "alert"
        ? 0.32
        : mode === "watch"
          ? 0.22
          : 0.16;

  const label =
    typeof windKmh === "number"
      ? labelFromWind(windKmh)
      : mode === "alert"
        ? "Yüksek"
        : mode === "watch"
          ? "Orta"
          : "Sakin";
  const labelColor =
    typeof windKmh === "number"
      ? colorFromWind(windKmh)
      : mode === "alert"
        ? "#FFD08A"
        : mode === "watch"
          ? "#A4F7E8"
          : brand.neonMint;

  useEffect(() => {
    spin.value = 0;
    spin.value = withRepeat(
      withTiming(1, { duration, easing: Easing.linear }),
      -1,
      false,
    );
    return () => {
      spin.value = 0;
    };
  }, [spin, duration]);

  const rotorStyle = useAnimatedStyle(() => {
    const deg = interpolate(spin.value, [0, 1], [0, 360]);
    return { transform: [{ rotate: `${deg}deg` }] };
  });

  // Layout constants relative to size
  const rotorR = size * 0.36;
  const bladeLen = size * 0.34;
  const bladeW = Math.max(6, size * 0.05);
  const hubR = Math.max(6, size * 0.045);
  const towerW = Math.max(5, size * 0.045);
  const towerH = size * 0.46;

  const cx = size / 2;
  const cy = size * 0.42;

  return (
    <View pointerEvents="none" className={className} style={{ width: size, height: size }}>
      {/* soft energy halo — opacity scales with wind */}
      <View
        style={{
          position: "absolute",
          left: cx - rotorR - 8,
          top: cy - rotorR - 8,
          width: (rotorR + 8) * 2,
          height: (rotorR + 8) * 2,
          borderRadius: rotorR + 8,
          backgroundColor: `rgba(94,234,212,${haloOpacity})`,
        }}
      />

      <View
        style={{
          position: "absolute",
          left: cx - towerW / 2,
          top: cy + hubR - 2,
          width: towerW,
          height: towerH,
          backgroundColor: "rgba(255,255,255,0.92)",
          borderTopLeftRadius: towerW / 2,
          borderTopRightRadius: towerW / 2,
          shadowColor: "#000",
          shadowOpacity: 0.18,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
        }}
      />
      <View
        style={{
          position: "absolute",
          left: cx - towerW * 1.6,
          top: cy + hubR + towerH - towerW,
          width: towerW * 3.2,
          height: towerW,
          backgroundColor: "rgba(255,255,255,0.55)",
          borderRadius: 2,
        }}
      />

      <View
        style={{
          position: "absolute",
          left: cx - hubR * 1.6,
          top: cy - hubR * 0.6,
          width: hubR * 3.2,
          height: hubR * 1.2,
          backgroundColor: "rgba(255,255,255,0.85)",
          borderRadius: hubR,
        }}
      />

      <Animated.View
        style={[
          rotorStyle,
          {
            position: "absolute",
            left: cx - rotorR,
            top: cy - rotorR,
            width: rotorR * 2,
            height: rotorR * 2,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        {[0, 120, 240].map((deg, idx) => (
          <View
            key={idx}
            style={{
              position: "absolute",
              width: bladeW,
              height: bladeLen,
              left: rotorR - bladeW / 2,
              top: rotorR - bladeLen,
              backgroundColor: brand.white,
              opacity: 0.95,
              borderTopLeftRadius: bladeW / 2,
              borderTopRightRadius: bladeW / 2,
              borderBottomLeftRadius: bladeW * 0.18,
              borderBottomRightRadius: bladeW * 0.18,
              transform: [
                { translateY: bladeLen / 2 },
                { rotate: `${deg}deg` },
                { translateY: -bladeLen / 2 },
              ],
              shadowColor: brand.neonMint,
              shadowOpacity: 0.5,
              shadowRadius: 8,
            }}
          />
        ))}
        <View
          style={{
            width: hubR * 2,
            height: hubR * 2,
            borderRadius: hubR,
            backgroundColor: brand.white,
            borderWidth: 2,
            borderColor: brand.tealLight,
          }}
        />
      </Animated.View>

      <View
        style={{
          position: "absolute",
          left: cx - 36,
          top: size - 22,
          width: 72,
          height: 22,
          borderRadius: 11,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.35)",
          backgroundColor: "rgba(8,24,39,0.78)",
        }}
      >
        <Text style={{ color: labelColor, fontSize: 10, fontWeight: "700", letterSpacing: 0.4 }}>
          {label}
          {typeof windKmh === "number" ? ` · ${Math.round(windKmh)}` : ""}
        </Text>
      </View>
    </View>
  );
};
