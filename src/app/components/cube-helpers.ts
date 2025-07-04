import * as THREE from 'three'
import { CubeState } from './cube-types'

const CUBE_SIZE = 3
const CUBE_GAP = 0.15
const COLORS = {
  RED: '#ff0000', GREEN: '#00ff00', BLUE: '#0000ff',
  YELLOW: '#ffff00', ORANGE: '#ffa500', WHITE: '#ffffff',
  BLACK: '#000000',
}

export const getInitialCubes = (): CubeState[] => {
  const cubes: CubeState[] = []
  for (let x = 0; x < CUBE_SIZE; x++) {
    for (let y = 0; y < CUBE_SIZE; y++) {
      for (let z = 0; z < CUBE_SIZE; z++) {
        if (x === 1 && y === 1 && z === 1) continue
        cubes.push({
          id: `${x}-${y}-${z}`,
          position: new THREE.Vector3((x - 1) * (1 + CUBE_GAP), (y - 1) * (1 + CUBE_GAP), (z - 1) * (1 + CUBE_GAP)),
          rotation: new THREE.Euler(0, 0, 0),
          colors: [
            x === 2 ? COLORS.RED : COLORS.BLACK, x === 0 ? COLORS.ORANGE : COLORS.BLACK,
            y === 2 ? COLORS.WHITE : COLORS.BLACK, y === 0 ? COLORS.YELLOW : COLORS.BLACK,
            z === 2 ? COLORS.BLUE : COLORS.BLACK, z === 0 ? COLORS.GREEN : COLORS.BLACK,
          ],
        })
      }
    }
  }
  return cubes
}

export const getGridCoords = (position: THREE.Vector3) => {
  const gap = 1 + CUBE_GAP
  return {
    x: Math.round(position.x / gap) + 1,
    y: Math.round(position.y / gap) + 1,
    z: Math.round(position.z / gap) + 1,
  }
}
