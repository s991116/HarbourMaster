import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, ShaderMaterial } from 'three'
import {
  DEFAULT_WATER_RIPPLE_SETTINGS,
  useWaterRippleSettingsStore,
} from '../store/waterRippleSettingsStore'
import { useSimulatorStore } from '../store/simulatorStore'

const BASE_COLOR = new Color('#1e5f74')

const vertexShader = /* glsl */ `
  varying vec2 vWorldXZ;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldXZ = worldPosition.xz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uWindDirection;
  uniform float uWindSpeed;
  uniform float uWindActive;
  uniform vec3 uBaseColor;
  uniform float uDriftScale;
  uniform float uVisualCapKnots;
  uniform float uRippleStrengthBase;
  uniform float uRippleStrengthScale;
  uniform float uSparkleMix;
  uniform float uSmoothstepLow;
  uniform float uSmoothstepHigh;
  uniform float uCalmAmp1;
  uniform float uCalmAmp2;
  uniform float uCalmAmp3;
  uniform float uWindyStreak1;
  uniform float uWindyStreak2;
  uniform float uWindyStreak3;
  uniform vec3 uHighlight;
  uniform vec3 uShadow;

  varying vec2 vWorldXZ;

  float calmPattern(vec2 xz, float time) {
    float radius = length(xz);
    return
      sin(radius * 0.11 - time * 0.07) * uCalmAmp1 +
      sin(radius * 0.19 + time * 0.05) * uCalmAmp2 +
      sin(xz.x * 0.23 + xz.y * 0.31 + time * 0.04) *
      sin(xz.x * 0.17 - xz.y * 0.21 - time * 0.03) * uCalmAmp3 +
      0.5;
  }

  float windyPattern(vec2 xz, float time, float direction, float windKnots, float visualFactor) {
    vec2 windDir = vec2(sin(direction), cos(direction));
    vec2 windAcross = vec2(windDir.y, -windDir.x);
    float along = dot(xz, windDir);
    float across = dot(xz, windAcross);
    float drift = time * windKnots * uDriftScale;

    float crossWarp =
      sin(across * 0.42 + drift * 0.28) * 2.6 +
      sin(across * 0.19 - drift * 0.16 + sin(along * 0.08) * 0.8) * 1.4;
    float alongWarped = along + crossWarp;

    float streak =
      sin(alongWarped * 0.55 - drift * 1.1) * uWindyStreak1 +
      sin(alongWarped * 1.05 - drift * 1.7 + sin(across * 0.62) * 1.1) * uWindyStreak2 +
      sin(across * 1.55 + sin(alongWarped * 0.24) * 1.6 - drift * 0.55) * uWindyStreak3 +
      0.5;

    float sparkle =
      sin(alongWarped * 2.2 - drift * 2.4 + sin(across * 0.9) * 0.9) * 0.5 + 0.5;
    return mix(streak, sparkle, uSparkleMix * clamp(visualFactor, 0.0, 1.0));
  }

  void main() {
    float windKnots = uWindSpeed * 1.94384;
    float visualFactor = min(windKnots, uVisualCapKnots) / 10.0;
    float calm = calmPattern(vWorldXZ, uTime);
    float windy = windyPattern(vWorldXZ, uTime, uWindDirection, windKnots, visualFactor);

    float pattern = mix(calm, windy, uWindActive);
    float softened = pattern * pattern * (3.0 - 2.0 * pattern);
    float contrasted = smoothstep(uSmoothstepLow, uSmoothstepHigh, softened);
    float rippleStrength = mix(
      uRippleStrengthBase,
      uRippleStrengthBase + visualFactor * uRippleStrengthScale,
      uWindActive
    );

    vec3 rippleColor = mix(uShadow, uHighlight, contrasted);
    vec3 color = mix(uBaseColor, rippleColor, rippleStrength);

    gl_FragColor = vec4(color, 1.0);
  }
`

function rippleUniformValues(settings = DEFAULT_WATER_RIPPLE_SETTINGS) {
  return {
    uDriftScale: settings.driftScale,
    uVisualCapKnots: settings.visualCapKnots,
    uRippleStrengthBase: settings.rippleStrengthBase,
    uRippleStrengthScale: settings.rippleStrengthScale,
    uSparkleMix: settings.sparkleMix,
    uSmoothstepLow: settings.smoothstepLow,
    uSmoothstepHigh: settings.smoothstepHigh,
    uCalmAmp1: settings.calmAmp1,
    uCalmAmp2: settings.calmAmp2,
    uCalmAmp3: settings.calmAmp3,
    uWindyStreak1: settings.windyStreak1,
    uWindyStreak2: settings.windyStreak2,
    uWindyStreak3: settings.windyStreak3,
    uHighlight: new Color(settings.highlightR, settings.highlightG, settings.highlightB),
    uShadow: new Color(settings.shadowR, settings.shadowG, settings.shadowB),
  }
}

type WaterSurfaceProps = {
  width: number
  depth: number
  centerX: number
  centerZ: number
}

export function WaterSurface({ width, depth, centerX, centerZ }: WaterSurfaceProps) {
  const materialRef = useRef<ShaderMaterial>(null)
  const wind = useSimulatorStore((s) => s.snapshot.wind)
  const rippleSettings = useWaterRippleSettingsStore((s) => s.settings)

  const windActive = wind.speed > 0 ? 1 : 0

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uWindDirection: { value: wind.direction },
      uWindSpeed: { value: wind.speed },
      uWindActive: { value: windActive },
      uBaseColor: { value: BASE_COLOR.clone() },
      ...Object.fromEntries(
        Object.entries(rippleUniformValues(DEFAULT_WATER_RIPPLE_SETTINGS)).map(([key, value]) => [
          key,
          { value },
        ]),
      ),
    }),
    [],
  )

  useLayoutEffect(() => {
    const material = materialRef.current
    if (!material) return
    material.uniforms.uWindDirection.value = wind.direction
    material.uniforms.uWindSpeed.value = wind.speed
    material.uniforms.uWindActive.value = windActive

    const rippleUniforms = rippleUniformValues(rippleSettings)
    for (const [key, value] of Object.entries(rippleUniforms)) {
      material.uniforms[key].value = value
    }
  }, [wind.direction, wind.speed, windActive, rippleSettings])

  useFrame((state) => {
    const material = materialRef.current
    if (!material) return
    material.uniforms.uTime.value = state.clock.elapsedTime
    material.uniforms.uWindSpeed.value = wind.speed
    material.uniforms.uWindActive.value = windActive
    if (windActive > 0) {
      material.uniforms.uWindDirection.value = wind.direction
    }
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[centerX, 0, centerZ]} receiveShadow>
      <planeGeometry args={[width, depth, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}
