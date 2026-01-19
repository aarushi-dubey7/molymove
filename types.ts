
export interface OrientationData {
  beta: number;  // x-axis rotation [-180, 180]
  gamma: number; // y-axis rotation [-90, 90]
  alpha: number; // z-axis rotation [0, 360]
}

export interface PeerMessage {
  type: 'ORIENTATION' | 'PING' | 'CONNECTED';
  data?: any;
}

export interface MoleculeAtom {
  element: string;
  position: [number, number, number];
  color: string;
  size: number;
}

export interface MoleculeBond {
  start: [number, number, number];
  end: [number, number, number];
}

export interface MoleculeData {
  name: string;
  formula: string;
  atoms: MoleculeAtom[];
  bonds: MoleculeBond[];
}
