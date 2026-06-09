import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, ShaderMaterial } from 'three'
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

  varying vec2 vWorldXZ;

  float calmPattern(vec2 xz, float time) {
    float radius = length(xz);
    return
      sin(radius * 0.11 - time * 0.07) * 0.18 +
      sin(radius * 0.19 + time * 0.05) * 0.12 +
      sin(xz.x * 0.23 + xz.y * 0.31 + time * 0.04) *
      sin(xz.x * 0.17 - xz.y * 0.21 - time * 0.03) * 0.32 +
      0.5;
  }

  float windyPattern(vec2 xz, float time, float direction, float windKnots, float speedFactor) {
    vec2 windDir = vec2(sin(direction), cos(direction));
    vec2 windAcross = vec2(windDir.y, -windDir.x);
    float along = dot(xz, windDir);
    float across = dot(xz, windAcross);
    // Drift scales linearly with wind speed in knots (20 kt ≈ 2× the pace of 10 kt).
    float drift = time * windKnots * 0.097;

    float streak =
      sin(along * 0.55 - drift * 1.1) * 0.5 +
      sin(along * 1.05 - drift * 1.7 + across * 0.18) * 0.35 +
      sin(across * 2.4 + along * 0.35 - drift * 0.85) * 0.15 +
      0.5;

    float sparkle =
      sin(along * 2.2 - drift * 2.4 + sin(across * 0.9) * 0.6) * 0.5 + 0.5;
    return mix(streak, sparkle, 0.22 * clamp(speedFactor, 0.0, 1.0));
  }

  void main() {
    float windKnots = uWindSpeed * 1.94384;
    float speedFactor = clamp(windKnots / 10.0, 0.0, 4.0);
    float calm = calmPattern(vWorldXZ, uTime);
    float windy = windyPattern(vWorldXZ, uTime, uWindDirection, windKnots, speedFactor);

    float pattern = mix(calm, windy, uWindActive);
    float rippleStrength = mix(0.012, 0.012 + speedFactor * 0.028, uWindActive);

    vec3 highlight = vec3(0.22, 0.50, 0.60);
    vec3 shadow = vec3(0.15, 0.36, 0.44);
    vec3 color = mix(uBaseColor, mix(shadow, highlight, pattern), rippleStrength);

    gl_FragColor = vec4(color, 1.0);
  }
`

type WaterSurfaceProps = {
  width: number
  depth: number
  centerX: number
  centerZ: number
}

export function WaterSurface({ width, depth, centerX, centerZ }: WaterSurfaceProps) {
  const materialRef = useRef<ShaderMaterial>(null)
  const wind = useSimulatorStore((s) => s.snapshot.wind)

  const windActive = wind.speed > 0 ? 1 : 0

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uWindDirection: { value: wind.direction },
      uWindSpeed: { value: wind.speed },
      uWindActive: { value: windActive },
      uBaseColor: { value: BASE_COLOR.clone() },
    }),
    [],
  )

  useLayoutEffect(() => {
    const material = materialRef.current
    if (!material) return
    material.uniforms.uWindDirection.value = wind.direction
    material.uniforms.uWindSpeed.value = wind.speed
    material.uniforms.uWindActive.value = windActive
  }, [wind.direction, wind.speed, windActive])

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
