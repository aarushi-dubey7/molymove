
import React, { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment, ContactShadows } from '@react-three/drei';
import { QRCodeSVG } from 'qrcode.react';
import { Peer } from 'peerjs';
import { Smartphone, Info, RefreshCw, Layers } from 'lucide-react';
import { MoleculeData, OrientationData, PeerMessage } from '../types';
import { MOLECULES } from '../constants';
import Molecule from './Molecule';
import { getMoleculeInfo } from '../services/geminiService';

const DesktopView: React.FC = () => {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [remoteOrientation, setRemoteOrientation] = useState<OrientationData | undefined>();
  const [currentMolecule, setCurrentMolecule] = useState<MoleculeData>(MOLECULES.caffeine);
  const [info, setInfo] = useState<string>("Loading molecule data...");
  const [loadingInfo, setLoadingInfo] = useState(false);

  useEffect(() => {
    const peer = new Peer();

    // Use type assertion to handle missing 'on' property in PeerJS types
    (peer as any).on('open', (id: string) => {
      setPeerId(id);
    });

    // Use type assertion to handle missing 'on' property in PeerJS types
    (peer as any).on('connection', (conn: any) => {
      setConnected(true);
      conn.on('data', (data: any) => {
        const msg = data as PeerMessage;
        if (msg.type === 'ORIENTATION') {
          setRemoteOrientation(msg.data);
        }
      });
      conn.on('close', () => setConnected(false));
    });

    return () => {
      peer.destroy();
    };
  }, []);

  const updateInfo = useCallback(async (mol: MoleculeData) => {
    setLoadingInfo(true);
    const text = await getMoleculeInfo(mol.name);
    setInfo(text);
    setLoadingInfo(false);
  }, []);

  useEffect(() => {
    updateInfo(currentMolecule);
  }, [currentMolecule, updateInfo]);

  const remoteUrl = `${window.location.origin}${window.location.pathname}#/remote/${peerId}`;

  return (
    <div className="relative w-full h-full bg-neutral-950 flex">
      {/* 3D Scene */}
      <div className="flex-grow h-full">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <color attach="background" args={['#050505']} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          
          <Molecule data={currentMolecule} remoteOrientation={remoteOrientation} />
          
          <ContactShadows opacity={0.4} scale={10} blur={2.4} far={10} resolution={256} color="#000000" />
          <Environment preset="city" />
          {/* Using spread with any to bypass OrbitControls type check for enablePan */}
          <OrbitControls makeDefault {...({ enablePan: false } as any)} />
        </Canvas>
      </div>

      {/* Sidebar UI */}
      <div className="w-96 bg-neutral-900/50 backdrop-blur-xl border-l border-white/10 p-8 overflow-y-auto flex flex-col gap-8 shadow-2xl">
        <header>
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            MolyRemote
          </h1>
          <p className="text-neutral-400 mt-2">Interactive 3D Molecular Laboratory</p>
        </header>

        <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Layers className="text-blue-400" size={20} />
            <h2 className="text-lg font-bold">Molecules</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(MOLECULES).map((mol) => (
              <button
                key={mol.name}
                onClick={() => setCurrentMolecule(mol)}
                className={`p-3 rounded-xl text-sm transition-all ${
                  currentMolecule.name === mol.name 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                }`}
              >
                {mol.name}
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Info className="text-purple-400" size={20} />
            <h2 className="text-lg font-bold">Chemistry Insights</h2>
          </div>
          <div className="text-neutral-400 text-sm leading-relaxed min-h-[80px]">
            {loadingInfo ? (
              <div className="flex items-center gap-2 animate-pulse">
                <RefreshCw className="animate-spin" size={14} />
                Synthesizing information...
              </div>
            ) : info}
          </div>
        </section>

        <section className="mt-auto bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-3xl p-6 border border-white/10 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 text-blue-400">
            <Smartphone size={20} />
            <h2 className="text-lg font-bold">Remote Controller</h2>
          </div>
          
          {peerId ? (
            <div className="flex flex-col items-center">
              <div className="bg-white p-3 rounded-xl mb-4 shadow-xl">
                <QRCodeSVG value={remoteUrl} size={160} />
              </div>
              <p className="text-xs text-neutral-500 mb-2">Scan with your phone to pair</p>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-xs font-mono uppercase tracking-wider">
                  {connected ? 'Device Linked' : 'Awaiting Pair'}
                </span>
              </div>
            </div>
          ) : (
            <div className="animate-pulse text-neutral-500 text-sm py-12">
              Generating pairing key...
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DesktopView;
