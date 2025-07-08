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

const rotateColors = (colors: string[], axis: 'x' | 'y' | 'z', dir: number): string[] => {
  const newColors = [...colors];
  // Colors array indices: 0:R, 1:O, 2:W, 3:Y, 4:B, 5:G
  // [+X, -X, +Y, -Y, +Z, -Z]
  const [r, o, w, y, b, g] = colors;

  if (axis === 'x') { // Right face rotation
    if (dir > 0) { // Clockwise: W->B, B->Y, Y->G, G->W
      newColors[2] = g; newColors[4] = w; newColors[3] = b; newColors[5] = y;
    } else { // Counter-clockwise
      newColors[2] = b; newColors[4] = y; newColors[3] = g; newColors[5] = w;
    }
  } else if (axis === 'y') { // Top face rotation
    if (dir > 0) { // Clockwise: B->R, R->G, G->O, O->B
      newColors[4] = o; newColors[0] = b; newColors[5] = r; newColors[1] = g;
    } else { // Counter-clockwise
      newColors[4] = r; newColors[0] = g; newColors[5] = o; newColors[1] = b;
    }
  } else if (axis === 'z') { // Front face rotation
    if (dir > 0) { // Clockwise: W->R, R->Y, Y->O, O->W
      newColors[2] = o; newColors[0] = w; newColors[3] = r; newColors[1] = y;
    } else { // Counter-clockwise
      newColors[2] = r; newColors[0] = y; newColors[3] = o; newColors[1] = w;
    }
  }
  return newColors;
};

export const performRotation = (
  cubes: CubeState[],
  axis: 'x' | 'y' | 'z',
  slice: number,
  direction: number
): CubeState[] => {
  let angle = (Math.PI / 2) * direction;
  if (axis === 'z') angle *= -1;

  const rotationMatrix = new THREE.Matrix4();
  if (axis === 'x') rotationMatrix.makeRotationX(angle);
  if (axis === 'y') rotationMatrix.makeRotationY(angle);
  if (axis === 'z') rotationMatrix.makeRotationZ(angle);

  return cubes.map(cube => {
    const gridCoords = getGridCoords(cube.position);
    if (gridCoords[axis] === slice) {
      const newPosition = cube.position.clone().applyMatrix4(rotationMatrix);
      const newColors = rotateColors(cube.colors, axis, direction);
      return { ...cube, position: newPosition, colors: newColors };
    }
    return cube;
  });
};
