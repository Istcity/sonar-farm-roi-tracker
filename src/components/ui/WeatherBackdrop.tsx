import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo } from "react";
import { View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { WeatherCondition, weatherBackdrops } from "../../theme/palettes";
import { WeatherSnapshot } from "../../types/weather";

type Props = {
  weather: WeatherSnapshot | null;
  height?: number;
  style?: ViewStyle;
};

/**
 * Picks a backdrop preset from the snapshot. Open-Meteo's `current` payload doesn't
 * include a weather-code in the existing fetcher, so we infer condition from
 * temperature, precipitation chance and humidity. Hour-of-day flips clear → night.
 */
export const inferCondition = (w: WeatherSnapshot | null, now: Date = new Date()): WeatherCondition => {
  const hour = now.getHours();
  const isNight = hour < 6 || hour >= 20;
  if (!w) return isNight ? "clear-night" : "clear-day";
  if (w.temperatureC <= 0 && w.precipitationChance >= 30) return "snow";
  if (w.precipitationChance >= 60) return "rain";
  if (w.precipitationChance >= 35 || w.humidity >= 85) return "cloudy";
  if (w.temperatureC >= 30) return "hot";
  return isNight ? "clear-night" : "clear-day";
};

/**
 * Animated, copyright-free weather backdrop. Renders a gradient sky and overlays
 * primitive shapes (sun glow, drifting clouds, rain streaks, snowflakes, stars)
 * driven entirely by Reanimated. Designed to sit *behind* a header / hero block.
 */
export const WeatherBackdrop: React.FC<Props> = ({ weather, height = 320, style }) => {
  const condition = useMemo(() => inferCondition(weather), [weather]);
  const stops = weatherBackdrops[condition];

  return (
    <View
      pointerEvents="none"
      style={[
        { position: "absolute", left: 0, right: 0, top: 0, height, overflow: "hidden" },
        style,
      ]}
    >
      <LinearGradient
        colors={stops}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
      />

      {condition === "clear-day" || condition === "hot" ? <SunLayer hot={condition === "hot"} /> : null}
      {condition === "clear-night" ? <StarsLayer /> : null}
      {condition === "cloudy" || condition === "rain" ? <CloudsLayer dense={condition === "rain"} /> : null}
      {condition === "rain" ? <RainLayer /> : null}
      {condition === "snow" ? <SnowLayer /> : null}
    </View>
  );
};

// ── Sun ─────────────────────────────────────────────────────────────────────
const SunLayer: React.FC<{ hot?: boolean }> = ({ hot }) => {
  const pulse = useSharedValue(0);
  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 4200, easing: Easing.inOut(Easing.sin) }), -1, true);
    return () => { pulse.value = 0; };
  }, [pulse]);

  const haloStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.55, 0.85]),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 1.08]) }],
  }));

  const core = hot ? "#FFD27A" : "#FFE5A8";
  const halo = hot ? "rgba(255,180,90,0.55)" : "rgba(255,225,150,0.55)";

  return (
    <View style={{ position: "absolute", top: 24, right: 28 }}>
      <Animated.View
        style={[
          haloStyle,
          {
            position: "absolute",
            width: 180,
            height: 180,
            left: -50,
            top: -50,
            borderRadius: 90,
            backgroundColor: halo,
          },
        ]}
      />
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: core,
          shadowColor: core,
          shadowOpacity: 0.9,
          shadowRadius: 20,
        }}
      />
    </View>
  );
};

// ── Stars (clear night) ─────────────────────────────────────────────────────
const StarsLayer: React.FC = () => {
  const stars = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        key: i,
        x: Math.random() * 100,
        y: Math.random() * 70,
        s: 1 + Math.random() * 2,
        o: 0.4 + Math.random() * 0.5,
      })),
    [],
  );
  return (
    <View style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}>
      {stars.map((s) => (
        <View
          key={s.key}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.s,
            height: s.s,
            borderRadius: s.s / 2,
            backgroundColor: "#FFFFFF",
            opacity: s.o,
          }}
        />
      ))}
      {/* Crescent moon */}
      <View style={{ position: "absolute", top: 28, right: 36 }}>
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: "#F2F6FF",
          }}
        />
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 14,
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: "#0A1A2A",
          }}
        />
      </View>
    </View>
  );
};

// ── Drifting clouds ─────────────────────────────────────────────────────────
const Cloud: React.FC<{ top: number; size: number; delay: number; opacity: number }> = ({
  top,
  size,
  delay,
  opacity,
}) => {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: 14000 + delay, easing: Easing.linear }),
      -1,
      false,
    );
    return () => { t.value = 0; };
  }, [t, delay]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(t.value, [0, 1], [-size, 420]) }],
  }));

  return (
    <Animated.View
      style={[
        style,
        {
          position: "absolute",
          top,
          width: size,
          height: size * 0.45,
          borderRadius: size * 0.3,
          backgroundColor: `rgba(255,255,255,${opacity})`,
        },
      ]}
    >
      <View
        style={{
          position: "absolute",
          top: -size * 0.18,
          left: size * 0.18,
          width: size * 0.55,
          height: size * 0.55,
          borderRadius: size * 0.3,
          backgroundColor: `rgba(255,255,255,${opacity})`,
        }}
      />
      <View
        style={{
          position: "absolute",
          top: -size * 0.12,
          right: size * 0.1,
          width: size * 0.4,
          height: size * 0.4,
          borderRadius: size * 0.25,
          backgroundColor: `rgba(255,255,255,${opacity})`,
        }}
      />
    </Animated.View>
  );
};

const CloudsLayer: React.FC<{ dense?: boolean }> = ({ dense }) => {
  const o = dense ? 0.55 : 0.42;
  return (
    <View style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}>
      <Cloud top={26} size={140} delay={0} opacity={o} />
      <Cloud top={70} size={100} delay={5200} opacity={o - 0.12} />
      <Cloud top={120} size={170} delay={9000} opacity={o - 0.05} />
      {dense ? <Cloud top={48} size={120} delay={2200} opacity={o} /> : null}
    </View>
  );
};

// ── Rain streaks ────────────────────────────────────────────────────────────
const RainDrop: React.FC<{ x: number; delay: number }> = ({ x, delay }) => {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withRepeat(
      withTiming(1, { duration: 1100 + delay, easing: Easing.linear }),
      -1,
      false,
    );
    return () => { v.value = 0; };
  }, [v, delay]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(v.value, [0, 1], [-20, 320]) }],
    opacity: interpolate(v.value, [0, 0.1, 0.9, 1], [0, 0.7, 0.7, 0]),
  }));

  return (
    <Animated.View
      style={[
        style,
        {
          position: "absolute",
          left: `${x}%`,
          width: 2,
          height: 14,
          backgroundColor: "rgba(220,235,255,0.85)",
          borderRadius: 1,
        },
      ]}
    />
  );
};

const RainLayer: React.FC = () => {
  const drops = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        key: i,
        x: Math.random() * 100,
        delay: Math.random() * 1000,
      })),
    [],
  );
  return (
    <View style={{ position: "absolute", left: 0, right: 0, top: 80, bottom: 0 }}>
      {drops.map((d) => <RainDrop key={d.key} x={d.x} delay={d.delay} />)}
    </View>
  );
};

// ── Snowflakes ──────────────────────────────────────────────────────────────
const Snowflake: React.FC<{ x: number; size: number; delay: number }> = ({ x, size, delay }) => {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withRepeat(
      withTiming(1, { duration: 6000 + delay, easing: Easing.linear }),
      -1,
      false,
    );
    return () => { v.value = 0; };
  }, [v, delay]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(v.value, [0, 1], [-20, 320]) },
      { translateX: interpolate(v.value, [0, 0.5, 1], [0, 6, -6]) },
    ],
    opacity: interpolate(v.value, [0, 0.1, 0.9, 1], [0, 0.95, 0.95, 0]),
  }));

  return (
    <Animated.View
      style={[
        style,
        {
          position: "absolute",
          left: `${x}%`,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: "#FFFFFF",
        },
      ]}
    />
  );
};

const SnowLayer: React.FC = () => {
  const flakes = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        key: i,
        x: Math.random() * 100,
        size: 3 + Math.random() * 3,
        delay: Math.random() * 3000,
      })),
    [],
  );
  return (
    <View style={{ position: "absolute", left: 0, right: 0, top: 60, bottom: 0 }}>
      {flakes.map((f) => <Snowflake key={f.key} x={f.x} size={f.size} delay={f.delay} />)}
    </View>
  );
};
