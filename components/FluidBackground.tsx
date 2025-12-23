"use client"

import { Canvas, useFrame, useThree, extend, ReactThreeFiber } from "@react-three/fiber"
import { shaderMaterial } from "@react-three/drei"
import { useRef } from "react"
import * as THREE from "three"

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  precision mediump float;

  uniform float uTime;
  uniform vec2 uSeedOffset;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(41.0, 289.0))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  vec3 getColor(float t) {
    if (t < 0.15) return vec3(0.827, 0.686, 1.0);
    else if (t < 0.30) return vec3(1.0, 0.616, 0.541);
    else if (t < 0.45) return vec3(0.604, 0.894, 0.706);
    else if (t < 0.60) return vec3(1.0, 0.886, 0.541);
    else if (t < 0.75) return vec3(1.0, 0.753, 0.475);
    else return vec3(0.475, 0.824, 0.557);
  }

  void main() {
    vec2 uv = vUv * 3.0;
    uv = mat2(cos(1.2), -sin(1.2), sin(1.2), cos(1.2)) * uv;
    uv += uSeedOffset;

    float ttime = uTime;

    float wave1 = sin(uv.x * 1.1 + ttime * 0.25) * 0.08;
    float wave2 = sin(uv.x * 2.0 - ttime * 0.18) * 0.03;
    float globalWave = wave1 + wave2;

    uv.y += globalWave;

    uv.x += ttime * 0.008;

    float bandY = uv.y + noise(uv * 6.0) * 0.012;
    float t = fract(bandY * 4.0);

    vec3 color = getColor(t);
    gl_FragColor = vec4(color, 1.0);
  }
`

const BlobShaderMaterial = shaderMaterial({ uTime: 0, uSeedOffset: new THREE.Vector2() }, vertexShader, fragmentShader)

extend({ BlobShaderMaterial })

declare module "@react-three/fiber" {
  interface ThreeElements {
    // @ts-expect-error: ReactThreeFiber.Node is available via named import
    blobShaderMaterial: ReactThreeFiber.Node<typeof BlobShaderMaterial, typeof BlobShaderMaterial>
  }
}

function BlobMaterial() {
  const ref = useRef<THREE.ShaderMaterial>(null!)
  const randomOffset = useRef(new THREE.Vector2(0.0, 0.0))

  const prevScroll = useRef(0)
  const speed = useRef(0)

  useFrame(({ clock }) => {
    const now = clock.getElapsedTime()
    const scrollY = window.scrollY || 0
    const delta = scrollY - prevScroll.current
    const scrollSpeed = Math.abs(delta)

    speed.current += (scrollSpeed - speed.current) * 0.1

    const timeBoost = speed.current * 0.01
    const finalTime = now + timeBoost

    const parallaxStrength = 0.003
    const scrollOffset = new THREE.Vector2(0, -scrollY * parallaxStrength)

    prevScroll.current = scrollY

    if (ref.current) {
      ref.current.uniforms.uTime.value = finalTime
      ref.current.uniforms.uSeedOffset.value = randomOffset.current.clone().add(scrollOffset)
    }
  })

  return <blobShaderMaterial ref={ref} attach="material" />
}

function FullscreenQuad() {
  const { viewport } = useThree()
  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <BlobMaterial />
    </mesh>
  )
}

export default function FluidBackground() {
  return (
    <div
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        zIndex: -1,
        pointerEvents: "none",
      }}
    >
      <Canvas orthographic camera={{ zoom: 100, position: [0, 0, 100] }}>
        <FullscreenQuad />
      </Canvas>
    </div>
  )
}
