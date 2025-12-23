/* eslint-disable react-hooks/immutability, react-hooks/refs */
"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { shaderMaterial } from "@react-three/drei"
import { useState } from "react"
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
  uniform vec3 uColors[6];

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv * 3.0;
    uv = mat2(cos(1.2), -sin(1.2), sin(1.2), cos(1.2)) * uv;

    float ttime = uTime;

    float wave1 = sin(uv.x * 1.1 + ttime * 0.18) * 0.06;
    float wave2 = sin(uv.x * 2.0 - ttime * 0.12) * 0.02;
    uv.y += (wave1 + wave2);

    uv.x += ttime * 0.006;

    float t = fract(uv.y * 3.4);

    vec3 color =
      (t < 1.0/6.0) ? uColors[0] :
      (t < 2.0/6.0) ? uColors[1] :
      (t < 3.0/6.0) ? uColors[2] :
      (t < 4.0/6.0) ? uColors[3] :
      (t < 5.0/6.0) ? uColors[4] :
                      uColors[5];

    gl_FragColor = vec4(color, 1.0);
  }
`

const BlobShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColors: [
      new THREE.Color("#ddc0ed"),
      new THREE.Color("#efcede"),
      new THREE.Color("#f4dfd8"),
      new THREE.Color("#faf7d8"),
      new THREE.Color("#d3f7e7"),
      new THREE.Color("#cfe0f0"),
    ],
  },
  vertexShader,
  fragmentShader
)

function BlobMaterial() {
  const [material] = useState(() => new (BlobShaderMaterial as any)())

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.getElapsedTime()
  })

  return <primitive object={material} attach="material" />
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
