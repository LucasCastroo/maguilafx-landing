"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Cena de partículas da hero (Three.js):
 * - Embers: brasas/faíscas subindo continuamente
 * - Fireworks: explosões cíclicas de fogos em posições pseudo-aleatórias
 * Tudo calculado no vertex shader a partir de seeds — zero custo de CPU
 * por frame, roda leve até em mobile.
 */

export type HeroPointer = { x: number; y: number };

const emberVertex = /* glsl */ `
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

const fireworkVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute vec4 aSeed;
  varying float vAlpha;
  varying vec3 vColor;

  float hash(float n) {
    return fract(sin(n) * 43758.5453123);
  }

  void main() {
    // 4 grupos defasados: sempre há uma explosão acontecendo em algum lugar
    float group = floor(aSeed.w * 4.0);
    float t = uTime * 0.22 + group * 0.25;
    float cycle = floor(t);
    float p = fract(t);

    float h1 = hash(cycle * 17.0 + group * 91.7);
    float h2 = hash(cycle * 23.0 + group * 57.3);

    vec3 origin = vec3((h1 - 0.5) * 17.0, 0.5 + h2 * 4.5, -2.0 - h2 * 4.0);

    // direção esférica por partícula
    float theta = aSeed.x * 6.28318;
    float cphi = aSeed.y * 2.0 - 1.0;
    float sphi = sqrt(max(0.0, 1.0 - cphi * cphi));
    vec3 dir = vec3(cos(theta) * sphi, cphi, sin(theta) * sphi);

    // expansão desacelerando + gravidade
    float radius = pow(p, 0.42) * mix(1.8, 3.4, aSeed.z);
    vec3 pos = origin + dir * radius;
    pos.y -= p * p * 1.8;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float flicker = 0.7 + 0.3 * sin(uTime * 20.0 + aSeed.x * 95.0);
    float fadeIn  = smoothstep(0.0, 0.05, p);
    float fadeOut = 1.0 - smoothstep(0.45, 1.0, p);
    vAlpha = flicker * fadeIn * fadeOut;

    vec3 warm = mix(vec3(1.0, 0.84, 0.42), vec3(1.0, 0.45, 0.15), h2);
    vColor = mix(warm, vec3(1.0, 0.2, 0.18), h1 * 0.65);

    float size = mix(9.0, 22.0, aSeed.z) * (1.0 - p * 0.55) * uPixelRatio;
    gl_PointSize = size / -mvPosition.z;
  }
`;

const pointFragment = /* glsl */ `
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

function useSeedGeometry(count: number) {
  return useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 4);
    for (let i = 0; i < count * 4; i++) seeds[i] = Math.random();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 4));
    return g;
  }, [count]);
}

function usePointUniforms() {
  return useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: {
        value:
          typeof window !== "undefined"
            ? Math.min(window.devicePixelRatio, 2)
            : 1,
      },
    }),
    []
  );
}

function ParticleScene({
  emberCount,
  fireworkCount,
  pointer,
}: {
  emberCount: number;
  fireworkCount: number;
  pointer?: HeroPointer;
}) {
  const group = useRef<THREE.Group>(null);
  const emberMat = useRef<THREE.ShaderMaterial>(null);
  const fireworkMat = useRef<THREE.ShaderMaterial>(null);

  const emberGeom = useSeedGeometry(emberCount);
  const fireworkGeom = useSeedGeometry(fireworkCount);
  const emberUniforms = usePointUniforms();
  const fireworkUniforms = usePointUniforms();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (emberMat.current) emberMat.current.uniforms.uTime.value = t;
    if (fireworkMat.current) fireworkMat.current.uniforms.uTime.value = t;

    if (group.current) {
      const px = pointer ? pointer.x : state.pointer.x;
      const py = pointer ? pointer.y : state.pointer.y;
      const targetX = py * 0.06;
      const targetY = px * 0.14;
      group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
      group.current.rotation.y += (targetY - group.current.rotation.y) * 0.04;
    }
  });

  return (
    <group ref={group}>
      <points geometry={emberGeom} frustumCulled={false}>
        <shaderMaterial
          ref={emberMat}
          vertexShader={emberVertex}
          fragmentShader={pointFragment}
          uniforms={emberUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <points geometry={fireworkGeom} frustumCulled={false}>
        <shaderMaterial
          ref={fireworkMat}
          vertexShader={fireworkVertex}
          fragmentShader={pointFragment}
          uniforms={fireworkUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function EmberCanvas({ pointer }: { pointer?: HeroPointer }) {
  const { emberCount, fireworkCount } = useMemo(() => {
    const mobile = typeof window !== "undefined" && window.innerWidth < 768;
    return {
      emberCount: mobile ? 1000 : 2400,
      fireworkCount: mobile ? 280 : 600,
    };
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
      <ParticleScene
        emberCount={emberCount}
        fireworkCount={fireworkCount}
        pointer={pointer}
      />
    </Canvas>
  );
}
