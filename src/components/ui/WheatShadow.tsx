import React, { useEffect } from "react";
import { View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { brand } from "../../theme/palettes";

type Props = { scrollY?: SharedValue<number> };

const C = brand.teal;

/**
 * Decorative background wheat sprout that GROWS as the user scrolls down.
 * Uses overflow:hidden clip + scroll-linked height animation to reveal
 * the plant from bottom to top — creating a natural sprouting illusion.
 */
export const WheatShadow: React.FC<Props> = ({ scrollY }) => {
  const { height: SH } = useWindowDimensions();
  const sway = useSharedValue(0);

  const FULL_H = Math.min(SH * 0.48, 300);
  const SCROLL_FULL = 440;

  // Gentle sway loop
  useEffect(() => {
    sway.value = withRepeat(
      withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    return () => {
      sway.value = 0;
    };
  }, [sway]);

  // Clip container height grows from tiny sprout to full plant
  const clipStyle = useAnimatedStyle(() => {
    const h = scrollY
      ? interpolate(scrollY.value, [0, SCROLL_FULL], [FULL_H * 0.04, FULL_H], "clamp")
      : FULL_H * 0.04;
    return { height: h };
  });

  // Whole plant sways
  const swayStyle = useAnimatedStyle(() => {
    const deg = interpolate(sway.value, [0, 1], [-3.5, 3.5]);
    return { transform: [{ rotate: `${deg}deg` }] };
  });

  // Grain head fades in once plant is ~50% grown
  const headStyle = useAnimatedStyle(() => {
    const prog = scrollY
      ? interpolate(scrollY.value, [0, SCROLL_FULL], [0, 1], "clamp")
      : 0;
    return { opacity: interpolate(prog, [0.45, 0.9], [0, 1], "clamp") };
  });

  // Leaves fade in once plant is ~25% grown
  const leafStyle = useAnimatedStyle(() => {
    const prog = scrollY
      ? interpolate(scrollY.value, [0, SCROLL_FULL], [0, 1], "clamp")
      : 0;
    return { opacity: interpolate(prog, [0.2, 0.65], [0, 1], "clamp") };
  });

  const HEAD_H = 82;
  const STEM_H = FULL_H - HEAD_H - 4;

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 12,
      }}
    >
      {/* Clip window — grows from bottom as user scrolls */}
      <Animated.View
        style={[clipStyle, { overflow: "hidden", width: 100, justifyContent: "flex-end" }]}
      >
        {/* Entire wheat plant — swaying */}
        <Animated.View
          style={[swayStyle, { width: 100, height: FULL_H, alignItems: "center", justifyContent: "flex-end" }]}
        >
          {/* ── Grain head (appears when tall enough) ── */}
          <Animated.View style={[headStyle, { alignItems: "center" }]}>
            <GrainHead height={HEAD_H} color={C} />
          </Animated.View>

          {/* ── Upper leaf right ── */}
          <Animated.View
            style={[
              leafStyle,
              { position: "absolute", top: HEAD_H + 14, left: 49 },
            ]}
          >
            <WheatLeaf color={C} side="right" length={36} />
          </Animated.View>

          {/* ── Lower leaf left ── */}
          <Animated.View
            style={[
              leafStyle,
              { position: "absolute", top: HEAD_H + 46, right: 49 },
            ]}
          >
            <WheatLeaf color={C} side="left" length={32} />
          </Animated.View>

          {/* ── Main stem ── */}
          <View
            style={{
              width: 3,
              height: STEM_H,
              backgroundColor: C,
              opacity: 0.3,
              borderRadius: 2,
              marginTop: 2,
            }}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Grain head: central spine + top awn + 8 grain spikelets (4 per side)
// ─────────────────────────────────────────────────────────────────────────────
const GrainHead: React.FC<{ height: number; color: string }> = ({ height, color }) => {
  // Spikelet pairs: [topFraction, leftEdge, rightEdge, angle]
  const pairs: Array<{ frac: number; angle: number }> = [
    { frac: 0.18, angle: 38 },
    { frac: 0.32, angle: 42 },
    { frac: 0.47, angle: 41 },
    { frac: 0.62, angle: 37 },
  ];

  return (
    <View style={{ width: 60, height }}>
      {/* Top awn */}
      <View
        style={{
          position: "absolute",
          width: 2,
          height: 13,
          backgroundColor: color,
          opacity: 0.22,
          borderRadius: 1,
          left: 29,
          top: 0,
        }}
      />

      {/* Central spine */}
      <View
        style={{
          position: "absolute",
          width: 4,
          height: height - 8,
          backgroundColor: color,
          opacity: 0.22,
          borderRadius: 2,
          left: 28,
          top: 10,
        }}
      />

      {/* Grain spikelets — left and right per row */}
      {pairs.map((p, i) => {
        const top = height * p.frac;
        return (
          <React.Fragment key={i}>
            {/* Left spikelet */}
            <View
              style={{
                position: "absolute",
                width: 20,
                height: 8,
                backgroundColor: color,
                opacity: 0.28,
                borderRadius: 4,
                left: 8,   // right edge at ~28 (spine left)
                top,
                transform: [{ rotate: `-${p.angle}deg` }],
              }}
            />
            {/* Right spikelet */}
            <View
              style={{
                position: "absolute",
                width: 20,
                height: 8,
                backgroundColor: color,
                opacity: 0.28,
                borderRadius: 4,
                left: 32,  // left edge at ~32 (spine right)
                top,
                transform: [{ rotate: `${p.angle}deg` }],
              }}
            />
          </React.Fragment>
        );
      })}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// A single wheat leaf — elongated oval at a diagonal angle
// ─────────────────────────────────────────────────────────────────────────────
const WheatLeaf: React.FC<{ color: string; side: "left" | "right"; length: number }> = ({
  color,
  side,
  length,
}) => (
  <View
    style={{
      width: length,
      height: 9,
      backgroundColor: color,
      opacity: 0.24,
      borderRadius: 4.5,
      transform: [{ rotate: side === "left" ? "-52deg" : "52deg" }],
    }}
  />
);
