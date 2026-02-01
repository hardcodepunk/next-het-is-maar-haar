"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { shaderMaterial } from "@react-three/drei"
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

    float t = uTime;
    uv.y += sin(uv.x * 1.1 + t * 0.18) * 0.1;
    uv.y += sin(uv.x * 2.0 - t * 0.12) * 0.06;
    uv.x += t * 0.006;

    float band = fract(uv.y * 3.4);

    vec3 color =
      (band < 1.0/6.0) ? uColors[0] :
      (band < 2.0/6.0) ? uColors[1] :
      (band < 3.0/6.0) ? uColors[2] :
      (band < 4.0/6.0) ? uColors[3] :
      (band < 5.0/6.0) ? uColors[4] :
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
  fragmentShader,
)

type BlobUniforms = {
  uTime: THREE.IUniform<number>
  uColors: THREE.IUniform<THREE.Color[]>
}

const blobMaterial = new BlobShaderMaterial() as unknown as THREE.ShaderMaterial & {
  uniforms: BlobUniforms
}

function BlobMaterial() {
  useFrame(({ clock }) => {
    blobMaterial.uniforms.uTime.value = clock.getElapsedTime()
  })
  return <primitive object={blobMaterial} attach="material" />
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
  const maskId = "corner-cut"

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: -1 }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Canvas orthographic camera={{ zoom: 100, position: [0, 0, 100] }}>
          <FullscreenQuad />
        </Canvas>
      </div>

      <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
        <defs>
          <mask id={maskId} maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
            <rect x="0" y="0" width="1" height="1" fill="white" />

            {/* top-left cut */}
            <path
              fill="black"
              d="
      M 0 0
      L 0.55 0
      C 0.42 0.10 0.34 0.26 0.20 0.24
      C 0.10 0.22 0.12 0.40 0.00 0.46
      Z
    "
            />

            {/* bottom-right cut (mirrored) */}
            {/* bottom-right cut – smaller, lighter, unique */}
            <path
              fill="black"
              d="
    M 1 1
    L 0.78 1
    C 0.86 0.96 0.90 0.88 0.94 0.84
    C 0.97 0.80 0.98 0.72 1.00 0.66
    Z
  "
            />
          </mask>
        </defs>
      </svg>

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          backgroundColor: "#b188d3",
          WebkitMask: `url(#${maskId})`,
          mask: `url(#${maskId})`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
          pointerEvents: "none",
        }}
      />
    </div>
  )
}
