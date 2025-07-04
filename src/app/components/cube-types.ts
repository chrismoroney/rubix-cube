import * as THREE from 'three'

export type SmallCubeProps = {
  cube: {
    id: string
    position: THREE.Vector3
    rotation: THREE.Euler
    colors: string[]
  }
  isHighlighted: boolean
}

export type CubeState = {
  id: string
  position: THREE.Vector3
  rotation: THREE.Euler
  colors: string[]
}
