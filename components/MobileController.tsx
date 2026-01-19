
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Peer, DataConnection } from 'peerjs';
import { Smartphone, Rotate3d, CheckCircle, Wifi, AlertTriangle } from 'lucide-react';
import { OrientationData, PeerMessage } from '../types';

interface MobileControllerProps {
  targetId: string;
}

const MobileController: React.FC<MobileControllerProps> = ({ targetId }) => {
  const [status, setStatus] = useState<'IDLE' | 'CONNECTING' | 'CONNECTED' | 'ERROR'>('IDLE');
  const [orientation, setOrientation] = useState<OrientationData>({ alpha: 0, beta: 0, gamma: 0 });
  const [errorMsg, setErrorMsg] = useState<string>('');
  const connRef = useRef<DataConnection | null>(null);
  const [needsPermission, setNeedsPermission] = useState(false);

  useEffect(() => {
    // Check if DeviceOrientation requires permission (iOS 13+)
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      setNeedsPermission(true);
    }
  }, []);

  const connectToDesktop = useCallback(() => {
    setStatus('CONNECTING');
    const peer = new Peer();
    
    // Cast to any to handle missing 'on' property in PeerJS types
    (peer as any).on('open', () => {
      const conn = peer.connect(targetId);
      connRef.current = conn;
      
      // Cast to any to handle missing 'on' property in PeerJS types
      (conn as any).on('open', () => {
        setStatus('CONNECTED');
        conn.send({ type: 'CONNECTED' });
      });

      // Cast to any to handle missing 'on' property in PeerJS types
      (conn as any).on('close', () => setStatus('IDLE'));
      (conn as any).on('error', (err: any) => {
        setStatus('ERROR');
        setErrorMsg('Connection failed');
      });
    });

    // Cast to any to handle missing 'on' property in PeerJS types
    (peer as any).on('error', (err: any) => {
      setStatus('ERROR');
      setErrorMsg(err.message);
    });
  }, [targetId]);

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    const data: OrientationData = {
      alpha: event.alpha || 0,
      beta: event.beta || 0,
      gamma: event.gamma || 0
    };
    setOrientation(data);
    if (connRef.current && connRef.current.open) {
      connRef.current.send({
        type: 'ORIENTATION',
        data: data
      } as PeerMessage);
    }
  }, []);

  const startSensors = async () => {
    try {
      if (needsPermission) {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response !== 'granted') {
          setErrorMsg('Permission denied for motion sensors');
          return;
        }
      }
      window.addEventListener('deviceorientation', handleOrientation);
      connectToDesktop();
    } catch (e) {
      setErrorMsg('Could not access sensors');
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-950 text-white flex flex-col items-center justify-center p-8 select-none overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-600/20 to-transparent pointer-events-none" />
      
      <div className="z-10 flex flex-col items-center text-center gap-8 w-full max-w-sm">
        <header>
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/40">
            <Smartphone size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold">Remote Node</h1>
          <p className="text-neutral-500 text-sm mt-1">Paired with Desktop Terminal</p>
        </header>

        <div className="w-full bg-neutral-900 border border-white/5 rounded-3xl p-8 shadow-2xl">
          {status === 'IDLE' && (
            <div className="flex flex-col gap-6">
              <p className="text-neutral-400 text-sm">Tap below to authorize motion sensors and establish link.</p>
              <button
                onClick={startSensors}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Wifi size={20} />
                Connect to Lab
              </button>
            </div>
          )}

          {status === 'CONNECTING' && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-neutral-400 font-medium">Establishing Peer Link...</p>
            </div>
          )}

          {status === 'CONNECTED' && (
            <div className="flex flex-col items-center gap-6 py-4">
              <div className="relative">
                <Rotate3d size={64} className="text-blue-500 animate-pulse" />
                <div className="absolute -top-2 -right-2">
                  <CheckCircle size={24} className="text-green-500 fill-neutral-950" />
                </div>
              </div>
              <div className="space-y-4 w-full">
                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono uppercase tracking-widest text-neutral-500 text-center">
                  <div>Pitch</div>
                  <div>Roll</div>
                  <div>Yaw</div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xl font-bold text-blue-400 text-center tabular-nums">
                  <div>{Math.round(orientation.beta)}°</div>
                  <div>{Math.round(orientation.gamma)}°</div>
                  <div>{Math.round(orientation.alpha)}°</div>
                </div>
              </div>
              <p className="text-xs text-neutral-500">Rotate your device to manipulate the 3D model in real-time.</p>
            </div>
          )}

          {status === 'ERROR' && (
            <div className="flex flex-col items-center gap-4 py-4">
              <AlertTriangle size={48} className="text-red-500" />
              <p className="text-red-400 text-sm font-medium">{errorMsg}</p>
              <button
                onClick={() => setStatus('IDLE')}
                className="text-xs text-neutral-400 underline"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        <div className="text-neutral-600 text-[10px] uppercase tracking-[0.2em]">
          Target: {targetId.slice(0, 8)}...
        </div>
      </div>
    </div>
  );
};

export default MobileController;
