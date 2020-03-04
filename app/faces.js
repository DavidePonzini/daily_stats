export const faces = {
  ALL: 'all stats',
  CALORIES: 'calories'
};


let face = faces.ALL;


export function getFace() {
  return face;
}


export function setFace(f) {
  face = f;
}

