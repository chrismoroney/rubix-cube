'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Plane } from '@react-three/drei'
import * as THREE from 'three'
import { getInitialCubes, getGridCoords } from './cube-helpers'
import { SmallCubeProps } from './cube-types'

const HIGHLIGHT_COLOR = new THREE.Color('#ffc800')

function SmallCube({ cube, isHighlighted, ...props }: SmallCubeProps & { [key: string]: any }) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.lerp(cube.position, 0.3)
      const targetQuaternion = new THREE.Quaternion().setFromEuler(cube.rotation)
      meshRef.current.quaternion.slerp(targetQuaternion, 0.3)
    }
  })

  return (
    <mesh ref={meshRef} {...props}>
      <boxGeometry args={[1, 1, 1]} />
      {cube.colors.map((color, index) => (
        <meshStandardMaterial
          key={index}
          attach={`material-${index}`}
          color={color}
          emissive={isHighlighted ? HIGHLIGHT_COLOR : '#000000'}
          emissiveIntensity={isHighlighted ? 0.6 : 0}
        />
      ))}
    </mesh>
  )
}

export default function Cube() {
  const [cubes, setCubes] = useState(getInitialCubes)
  const [selectedSlice, setSelectedSlice] = useState<{ axis: 'x' | 'y' | 'z'; slice: number } | null>(null)
  const selectionCycle = useRef<{ cubeId: string | null; axes: ('x' | 'y' | 'z')[]; index: number }>({ cubeId: null, axes: [], index: 0 })

  const highlightedCubes = useMemo(() => {
    if (!selectedSlice) return new Set()
    const { axis, slice } = selectedSlice
    const highlighted = new Set()
    cubes.forEach(cube => {
      const gridCoords = getGridCoords(cube.position)
      if (gridCoords[axis] === slice) {
        highlighted.add(cube.id)
      }
    })
    return highlighted
  }, [selectedSlice, cubes])

  const handleCubeClick = (e: any) => {
    e.stopPropagation()
    const clickedId = e.object.userData.id
    const clickedCube = cubes.find(c => c.id === clickedId)
    if (!clickedCube) return

    const normal = e.face.normal.clone().round()
    const gridCoords = getGridCoords(clickedCube.position)

    if (clickedId !== selectionCycle.current.cubeId) {
      const faceAxis = ['x', 'y', 'z'].find(ax => Math.abs(normal[ax]) === 1)
      const otherAxes = ['x', 'y', 'z'].filter(ax => ax !== faceAxis)
      selectionCycle.current = { cubeId: clickedId, axes: [faceAxis, ...otherAxes].filter(Boolean) as ('x' | 'y' | 'z')[], index: 0 }
    } else {
      selectionCycle.current.index = (selectionCycle.current.index + 1) % selectionCycle.current.axes.length
    }
    
    const currentAxis = selectionCycle.current.axes[selectionCycle.current.index]
    setSelectedSlice({ axis: currentAxis, slice: gridCoords[currentAxis] })
  }

  const rotateSlice = (direction: number) => {
    if (!selectedSlice) return
    const { axis, slice } = selectedSlice
    
    const angle = (Math.PI / 2) * direction
    const rotationMatrix = new THREE.Matrix4()
    if (axis === 'x') rotationMatrix.makeRotationX(angle)
    if (axis === 'y') rotationMatrix.makeRotationY(angle)
    if (axis === 'z') rotationMatrix.makeRotationZ(angle)

    setCubes(prevCubes =>
      prevCubes.map(cube => {
        const gridCoords = getGridCoords(cube.position)
        if (gridCoords[axis] === slice) {
          const newPosition = cube.position.clone().applyMatrix4(rotationMatrix)
          const newRotation = new THREE.Euler().setFromQuaternion(
            new THREE.Quaternion().setFromEuler(cube.rotation).multiply(new THREE.Quaternion().setFromRotationMatrix(rotationMatrix))
          )
          return { ...cube, position: newPosition, rotation: newRotation }
        }
        return cube
      })
    )
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') rotateSlice(-1)
      if (e.key === 'ArrowRight') rotateSlice(1)
      if (e.key === 'Escape') {
        setSelectedSlice(null)
        selectionCycle.current = { cubeId: null, axes: [], index: 0 }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedSlice])

  return (
    <div className="w-full h-screen">
      <Canvas onPointerMissed={() => {
        setSelectedSlice(null)
        selectionCycle.current = { cubeId: null, axes: [], index: 0 }
      }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} />
        <group rotation={[Math.PI / 4, Math.PI / 4, 0]} scale={0.8}>
          {cubes.map(cube => (
            <SmallCube
              key={cube.id}
              cube={cube}
              isHighlighted={highlightedCubes.has(cube.id)}
              userData={{ id: cube.id }}
              onPointerDown={handleCubeClick}
            />
          ))}
        </group>
        <OrbitControls enableZoom={false} />
        <Plane
          args={[100, 100]}
          position={[0, 0, -10]}
          onPointerDown={(e) => {
            e.stopPropagation()
            setSelectedSlice(null)
            selectionCycle.current = { cubeId: null, axes: [], index: 0 }
          }}
        >
          <meshBasicMaterial transparent opacity={0} />
        </Plane>
      </Canvas>
    </div>
  )
}

