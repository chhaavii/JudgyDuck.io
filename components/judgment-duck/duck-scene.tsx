"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Float } from "@react-three/drei"
import * as THREE from "three"

// Suppress THREE.Clock deprecation warning (comes from R3F internals)
const originalWarn = console.warn
console.warn = (...args) => {
  if (args[0]?.includes?.("THREE.Clock") || (typeof args[0] === "string" && args[0].includes("Clock"))) {
    return
  }
  originalWarn.apply(console, args)
}

export type DuckEmotion = "neutral" | "skeptical" | "judging" | "surprised" | "disappointed" | "amused" | "intense"

interface DuckModelProps {
  speaking: boolean
  judgmentMode: boolean
  emotion: DuckEmotion
}

// Procedural duck made with Three.js primitives
function DuckModel({ speaking, judgmentMode, emotion }: DuckModelProps) {
  const duckRef = useRef<THREE.Group>(null)
  const leftEyeRef = useRef<THREE.Group>(null)
  const rightEyeRef = useRef<THREE.Group>(null)
  const leftBrowRef = useRef<THREE.Mesh>(null)
  const rightBrowRef = useRef<THREE.Mesh>(null)
  const beakTopRef = useRef<THREE.Mesh>(null)
  const beakBottomRef = useRef<THREE.Mesh>(null)
  
  const blinkTimerRef = useRef(0)
  const elapsedTimeRef = useRef(0)
  const isBlinkingRef = useRef(false)
  const targetRotation = useRef(0)

  // Emotion configurations
  const getEmotionConfig = (emotion: DuckEmotion) => {
    switch (emotion) {
      case "skeptical":
        return {
          leftBrowRotation: 0.3,
          rightBrowRotation: -0.1,
          leftBrowY: 0.48,
          rightBrowY: 0.45,
          eyeScale: 1,
          pupilOffsetX: 0.01,
          pupilOffsetY: -0.01,
          beakOpen: 0,
        }
      case "judging":
        return {
          leftBrowRotation: -0.2,
          rightBrowRotation: -0.2,
          leftBrowY: 0.44,
          rightBrowY: 0.44,
          eyeScale: 0.85,
          pupilOffsetX: 0,
          pupilOffsetY: 0.02,
          beakOpen: 0,
        }
      case "surprised":
        return {
          leftBrowRotation: 0,
          rightBrowRotation: 0,
          leftBrowY: 0.52,
          rightBrowY: 0.52,
          eyeScale: 1.3,
          pupilOffsetX: 0,
          pupilOffsetY: 0,
          beakOpen: 0.08,
        }
      case "disappointed":
        return {
          leftBrowRotation: 0.25,
          rightBrowRotation: 0.25,
          leftBrowY: 0.43,
          rightBrowY: 0.43,
          eyeScale: 0.9,
          pupilOffsetX: 0,
          pupilOffsetY: -0.02,
          beakOpen: 0,
        }
      case "amused":
        return {
          leftBrowRotation: 0.15,
          rightBrowRotation: -0.15,
          leftBrowY: 0.47,
          rightBrowY: 0.47,
          eyeScale: 1.1,
          pupilOffsetX: 0.005,
          pupilOffsetY: 0.01,
          beakOpen: 0.03,
        }
      case "intense":
        return {
          leftBrowRotation: -0.35,
          rightBrowRotation: -0.35,
          leftBrowY: 0.42,
          rightBrowY: 0.42,
          eyeScale: 1.15,
          pupilOffsetX: 0,
          pupilOffsetY: 0.025,
          beakOpen: 0,
        }
      default: // neutral
        return {
          leftBrowRotation: 0,
          rightBrowRotation: 0,
          leftBrowY: 0.46,
          rightBrowY: 0.46,
          eyeScale: 1,
          pupilOffsetX: 0,
          pupilOffsetY: 0,
          beakOpen: 0,
        }
    }
  }

  useFrame((_, delta) => {
    if (!duckRef.current) return

    const config = getEmotionConfig(emotion)
    
    // Manual time accumulation
    elapsedTimeRef.current += delta
    const time = elapsedTimeRef.current

    // Idle animation - subtle floating motion
    duckRef.current.position.y = Math.sin(time * 0.5) * 0.05

    // Blinking logic (less frequent when intense/judging)
    const blinkInterval = emotion === "intense" || emotion === "judging" ? 6 : 3
    blinkTimerRef.current += delta
    if (blinkTimerRef.current > blinkInterval + Math.random() * 2) {
      isBlinkingRef.current = true
      setTimeout(() => { isBlinkingRef.current = false }, 150)
      blinkTimerRef.current = 0
    }

    // Head tilt animation
    if (speaking) {
      targetRotation.current = Math.sin(time * 3) * 0.12
    } else if (judgmentMode) {
      targetRotation.current = Math.sin(time * 0.3) * 0.05
    } else if (emotion === "skeptical") {
      targetRotation.current = 0.1 + Math.sin(time * 0.3) * 0.02
    } else {
      targetRotation.current = Math.sin(time * 0.5) * 0.15
    }

    duckRef.current.rotation.z = THREE.MathUtils.lerp(
      duckRef.current.rotation.z,
      targetRotation.current,
      0.05
    )

    // Scale animation
    const blinkScale = isBlinkingRef.current ? 0.98 : 1
    const targetScale = (judgmentMode ? 1.3 : 1.1) * blinkScale
    duckRef.current.scale.setScalar(
      THREE.MathUtils.lerp(duckRef.current.scale.x, targetScale, 0.02)
    )

    // Animate eyebrows
    if (leftBrowRef.current && rightBrowRef.current) {
      leftBrowRef.current.rotation.z = THREE.MathUtils.lerp(
        leftBrowRef.current.rotation.z,
        config.leftBrowRotation,
        0.08
      )
      rightBrowRef.current.rotation.z = THREE.MathUtils.lerp(
        rightBrowRef.current.rotation.z,
        config.rightBrowRotation,
        0.08
      )
      leftBrowRef.current.position.y = THREE.MathUtils.lerp(
        leftBrowRef.current.position.y,
        config.leftBrowY,
        0.08
      )
      rightBrowRef.current.position.y = THREE.MathUtils.lerp(
        rightBrowRef.current.position.y,
        config.rightBrowY,
        0.08
      )
    }

    // Animate eyes
    const eyeScale = isBlinkingRef.current ? 0.1 : config.eyeScale
    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.setScalar(
        THREE.MathUtils.lerp(leftEyeRef.current.scale.x, eyeScale, 0.15)
      )
      rightEyeRef.current.scale.setScalar(
        THREE.MathUtils.lerp(rightEyeRef.current.scale.x, eyeScale, 0.15)
      )
    }

    // Animate beak
    if (beakTopRef.current && beakBottomRef.current) {
      const beakOpen = speaking ? Math.abs(Math.sin(time * 8)) * 0.06 : config.beakOpen
      beakTopRef.current.position.y = THREE.MathUtils.lerp(
        beakTopRef.current.position.y,
        0.2 + beakOpen,
        0.1
      )
      beakBottomRef.current.position.y = THREE.MathUtils.lerp(
        beakBottomRef.current.position.y,
        0.13 - beakOpen,
        0.1
      )
    }
  })

  const duckYellow = "#f5c842"
  const duckOrange = "#e67e22"
  const eyeColor = "#1a1a1a"

  const config = getEmotionConfig(emotion)

  return (
    <group ref={duckRef} position={[0, 0, 0]}>
      {/* Body - main ellipsoid */}
      <mesh position={[0, -0.3, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={duckYellow} roughness={0.3} metalness={0.1} />
      </mesh>
      
      {/* Body bottom - flattened sphere for sitting */}
      <mesh position={[0, -0.55, 0]} scale={[1.1, 0.5, 1]}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color={duckYellow} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.25, 0.15]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color={duckYellow} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Beak - top part */}
      <mesh ref={beakTopRef} position={[0, 0.2, 0.45]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.2, 0.08, 0.25]} />
        <meshStandardMaterial color={duckOrange} roughness={0.4} />
      </mesh>
      
      {/* Beak - bottom part */}
      <mesh ref={beakBottomRef} position={[0, 0.13, 0.43]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.18, 0.06, 0.2]} />
        <meshStandardMaterial color={duckOrange} roughness={0.4} />
      </mesh>

      {/* Left Eyebrow */}
      <mesh ref={leftBrowRef} position={[-0.12, 0.46, 0.44]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.1, 0.02, 0.02]} />
        <meshStandardMaterial color="#3d3d3d" roughness={0.5} />
      </mesh>

      {/* Right Eyebrow */}
      <mesh ref={rightBrowRef} position={[0.12, 0.46, 0.44]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.1, 0.02, 0.02]} />
        <meshStandardMaterial color="#3d3d3d" roughness={0.5} />
      </mesh>

      {/* Left Eye */}
      <group ref={leftEyeRef} position={[-0.12, 0.35, 0.38]}>
        <mesh>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        <mesh position={[config.pupilOffsetX, config.pupilOffsetY, 0.04]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color={eyeColor} roughness={0.1} />
        </mesh>
        {/* Eye highlight */}
        <mesh position={[0.02, 0.02, 0.06]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Right Eye */}
      <group ref={rightEyeRef} position={[0.12, 0.35, 0.38]}>
        <mesh>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        <mesh position={[-config.pupilOffsetX, config.pupilOffsetY, 0.04]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color={eyeColor} roughness={0.1} />
        </mesh>
        {/* Eye highlight */}
        <mesh position={[0.02, 0.02, 0.06]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Tail feathers */}
      <mesh position={[0, -0.1, -0.45]} rotation={[-0.5, 0, 0]}>
        <coneGeometry args={[0.15, 0.3, 8]} />
        <meshStandardMaterial color={duckYellow} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Left Wing */}
      <mesh position={[-0.45, -0.2, -0.05]} rotation={[0, 0, 0.3]} scale={[0.3, 0.5, 0.15]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color={duckYellow} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Right Wing */}
      <mesh position={[0.45, -0.2, -0.05]} rotation={[0, 0, -0.3]} scale={[0.3, 0.5, 0.15]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color={duckYellow} roughness={0.3} metalness={0.1} />
      </mesh>
    </group>
  )
}

interface SpotlightEffectProps {
  judgmentMode: boolean
  emotion: DuckEmotion
}

function SpotlightEffect({ judgmentMode, emotion }: SpotlightEffectProps) {
  const lightRef = useRef<THREE.SpotLight>(null)
  const elapsedTimeRef = useRef(0)

  // Different light colors based on emotion
  const getLightColor = () => {
    if (judgmentMode) return "#ffd700"
    switch (emotion) {
      case "disappointed": return "#ff9999"
      case "intense": return "#ff6b6b"
      case "amused": return "#98fb98"
      case "surprised": return "#87ceeb"
      default: return "#ffffff"
    }
  }

  useFrame((_, delta) => {
    if (!lightRef.current) return
    
    elapsedTimeRef.current += delta
    const time = elapsedTimeRef.current

    if (judgmentMode) {
      lightRef.current.intensity = 80 + Math.sin(time * 0.5) * 20
    } else if (emotion === "intense") {
      lightRef.current.intensity = 70 + Math.sin(time * 2) * 15
    } else {
      lightRef.current.intensity = 50 + Math.sin(time) * 10
    }
  })

  return (
    <>
      <spotLight
        ref={lightRef}
        position={[0, 5, 3]}
        angle={0.4}
        penumbra={0.8}
        intensity={50}
        color={getLightColor()}
        castShadow
      />
      <ambientLight intensity={0.1} />
    </>
  )
}

interface DuckSceneProps {
  speaking: boolean
  judgmentMode: boolean
  emotion?: DuckEmotion
  className?: string
}

export function DuckScene({ speaking, judgmentMode, emotion = "neutral", className }: DuckSceneProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        shadows
        gl={{ antialias: true }}
      >
        <color attach="background" args={[judgmentMode ? "#0a0a0a" : "#0f0f0f"]} />
        <fog attach="fog" args={[judgmentMode ? "#0a0a0a" : "#0f0f0f", 3, 10]} />
        
        <SpotlightEffect judgmentMode={judgmentMode} emotion={emotion} />
        
        <Float
          speed={1}
          rotationIntensity={0.2}
          floatIntensity={0.3}
          floatingRange={[-0.05, 0.05]}
        >
          <DuckModel speaking={speaking} judgmentMode={judgmentMode} emotion={emotion} />
        </Float>

        <Environment preset="night" />
      </Canvas>
    </div>
  )
}
