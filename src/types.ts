
export type DefectLabel = 'Scratch' | 'Particle' | 'Crack';

export interface Annotation {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  label: DefectLabel;
}

export interface Point {
  x: number;
  y: number;
}
