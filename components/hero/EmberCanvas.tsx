"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Campo de brasas/faíscas em GPU (Three.js).
 * Todas as posições são calculadas no vertex shader a partir de seeds
 * aleatórias — zero custo de CPU por frame, roda leve até em mobile.
 */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute vec4 aSeed;
  varying float vAlpha;
  varying vec3 vColor;

  const vec3 GOLD   = vec3(1.0, 0.78, 0.35);
  const vec3 ORANGE = vec3(1.0, 0.45, 0.12);
  const vec3 RED    = vec3(1.0, 0.18, 0.16);

  void main() {
    float speed = mix(0.025, 0.11, aSeed.z);
    float progress = fract(aSeed.y + uTime * speed);

    float x = (aSeed.x - 0.5) * 24.0;
    x += sin(progress * 6.2831 * mix(1.0, 3.0, aSeed.w) + aSeed.x * 43.0)
         * mix(0.25, 1.4, aSeed.w);

    float y = -6.5 + progress * 14.0;
    float z = (aSeed.w - 0.5) * 7.0;

    vec4 mvPosition = modelViewMatrix * vec4(x, y, z, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float flicker = 0.72 + 0.28 * sin(uTime * mix(5.0, 15.0, aSeed.z) + aSeed.x * 120.0);
    float fadeIn  = smoothstep(0.0, 0.1, progress);
    float fadeOut = 1.0 - smoothstep(0.5, 1.0, progress);
    vAlpha = flicker * fadeIn * fadeOut;

    vec3 warm = mix(GOLD, ORANGE, aSeed.z);
    vColor = mix(warm, RED, aSeed.w * 0.55);

    float size = mix(9.0, 30.0, pow(aSeed.z, 2.0)) * uPixelRatio;
    gl_PointSize = size / -mvPosition.z;
  }
`;

const fragmentShader = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float glow = exp(-d * d * 14.0);
    float core = smoothstep(0.22, 0.0, d);
    float a = (glow * 0.55 + core) * vAlpha;
    if (a < 0.015) discard;
    gl_FragColor = vec4(vColor * (0.75 + core * 0.6), a);
  }
`;

function Embers({ count }: { count: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const group = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 4);
    for (let i = 0; i < count * 4; i++) seeds[i] = Math.random();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 4));
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: {
        value: typeof window !== "undefined"
          ? Math.min(window.devicePixelRatio, 2)
          : 1,
      },
    }),
    []
  );

  useFrame((state) => {
    if (material.current) {
      material.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (group.current) {
      // parallax sutil seguindo o mouse
      const targetX = state.pointer.y * 0.06;
      const targetY = state.pointer.x * 0.12;
      group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
      group.current.rotation.y += (targetY - group.current.rotation.y) * 0.04;
    }
  });

  return (
    <group ref={group}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={material}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function EmberCanvas() {
  const count = useMemo(() => {
    if (typeof window === "undefined") return 1800;
    return window.innerWidth < 768 ? 1000 : 2400;
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 55 }}
      dpr={[1, 1.75]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <Embers count={count} />
    </Canvas>
  );
}
