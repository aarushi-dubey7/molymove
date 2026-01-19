
import { MoleculeData } from './types';

export const SYSTEM_INSTRUCTION = `You are an expert chemist and 3D visualization assistant. 
When asked about a molecule, provide a brief, engaging summary (max 3 sentences) including its common uses and interesting facts. 
Use a sophisticated but accessible tone.`;

export const MOLECULES: Record<string, MoleculeData> = {
  water: {
    name: 'Water',
    formula: 'H2O',
    atoms: [
      { element: 'O', position: [0, 0, 0], color: '#ff4d4d', size: 0.6 },
      { element: 'H', position: [0.8, 0.6, 0], color: '#ffffff', size: 0.35 },
      { element: 'H', position: [-0.8, 0.6, 0], color: '#ffffff', size: 0.35 },
    ],
    bonds: [
      { start: [0, 0, 0], end: [0.8, 0.6, 0] },
      { start: [0, 0, 0], end: [-0.8, 0.6, 0] },
    ],
  },
  methane: {
    name: 'Methane',
    formula: 'CH4',
    atoms: [
      { element: 'C', position: [0, 0, 0], color: '#444444', size: 0.5 },
      { element: 'H', position: [0.7, 0.7, 0.7], color: '#ffffff', size: 0.3 },
      { element: 'H', position: [-0.7, -0.7, 0.7], color: '#ffffff', size: 0.3 },
      { element: 'H', position: [-0.7, 0.7, -0.7], color: '#ffffff', size: 0.3 },
      { element: 'H', position: [0.7, -0.7, -0.7], color: '#ffffff', size: 0.3 },
    ],
    bonds: [
      { start: [0, 0, 0], end: [0.7, 0.7, 0.7] },
      { start: [0, 0, 0], end: [-0.7, -0.7, 0.7] },
      { start: [0, 0, 0], end: [-0.7, 0.7, -0.7] },
      { start: [0, 0, 0], end: [0.7, -0.7, -0.7] },
    ],
  },
  caffeine: {
    name: 'Caffeine',
    formula: 'C8H10N4O2',
    atoms: [
        // simplified model for visualization performance
      { element: 'N', position: [0, 1.4, 0], color: '#3366ff', size: 0.4 },
      { element: 'C', position: [1.2, 0.7, 0], color: '#444444', size: 0.45 },
      { element: 'C', position: [1.2, -0.7, 0], color: '#444444', size: 0.45 },
      { element: 'N', position: [0, -1.4, 0], color: '#3366ff', size: 0.4 },
      { element: 'C', position: [-1.2, -0.7, 0], color: '#444444', size: 0.45 },
      { element: 'C', position: [-1.2, 0.7, 0], color: '#444444', size: 0.45 },
      { element: 'O', position: [2.3, 1.3, 0], color: '#ff4d4d', size: 0.4 },
      { element: 'O', position: [-2.3, -1.3, 0], color: '#ff4d4d', size: 0.4 },
    ],
    bonds: [
      { start: [0, 1.4, 0], end: [1.2, 0.7, 0] },
      { start: [1.2, 0.7, 0], end: [1.2, -0.7, 0] },
      { start: [1.2, -0.7, 0], end: [0, -1.4, 0] },
      { start: [0, -1.4, 0], end: [-1.2, -0.7, 0] },
      { start: [-1.2, -0.7, 0], end: [-1.2, 0.7, 0] },
      { start: [-1.2, 0.7, 0], end: [0, 1.4, 0] },
      { start: [1.2, 0.7, 0], end: [2.3, 1.3, 0] },
      { start: [-1.2, -0.7, 0], end: [-2.3, -1.3, 0] },
    ],
  }
};
