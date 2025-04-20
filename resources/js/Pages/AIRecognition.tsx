import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';

interface RecognitionData {
  face: string;
  plate: string;
  time: string;
}

export default function AIRecognition() {
  const [data, setData] = useState<RecognitionData>({ face: '', plate: '', time: '' });
  const [liveTs, setLiveTs] = useState<number>(Date.now());
  const [infoTs, setInfoTs] = useState<number>(Date.now());

  // Poll detection data
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await fetch('/web/data.json');
        if (res.ok) {
          const json = await res.json();
          setData(json);
          setInfoTs(Date.now());
        }
      } catch (e) {
        console.error('Error fetching AI data:', e);
      }
    };
    fetchInfo();
    const interval = setInterval(fetchInfo, 2000);
    return () => clearInterval(interval);
  }, []);

  // Refresh live image
  useEffect(() => {
    const iv = setInterval(() => {
      setLiveTs(Date.now());
    }, 500);
    return () => clearInterval(iv);
  }, []);

  const isAuth = data.face && data.face !== 'UNKNOWN PERSON' && data.face !== 'No Detection';
  const statusBorder = isAuth ? 'border-green-400' : 'border-red-400';
  const statusText   = isAuth ? 'text-green-600'   : 'text-red-600';

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 via-white to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">AI Recognition Dashboard</h1>
          <Link href={route('dashboard')} className="text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Live Feed */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4 bg-indigo-100">
              <h2 className="text-xl font-semibold text-indigo-700">Live Camera Feed</h2>
            </div>
            <div className="p-4">
              <img
                src={`/web/frame.jpg?${liveTs}`}
                alt="Live Camera"
                className="w-full h-auto rounded-lg border-4 border-indigo-200 shadow-inner animate-pulse"
              />
            </div>
          </div>

          {/* Analysis Panel */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
            <div className="p-4 bg-green-100">
              <h2 className="text-xl font-semibold text-green-700">Analysis & Details</h2>
            </div>
            <div className="p-4 flex-1 flex flex-col items-center justify-center">
              {/* Latest Frame */}
              <div className="w-full mb-4">
                <img
                  src={`/web/frame.jpg?${infoTs}`}
                  alt="Analysis Frame"
                  className={`w-full h-auto rounded-lg border-4 ${statusBorder} shadow-md`}
                />
              </div>
              {/* Info Cards */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-4 border-l-4 ${statusBorder} bg-gray-50 rounded-lg`}>
                  <p className="text-sm font-medium text-gray-600">Face Detected</p>
                  <p className="mt-1 text-lg font-bold text-gray-800">{data.face || 'N/A'}</p>
                </div>
                <div className={`p-4 border-l-4 ${statusBorder} bg-gray-50 rounded-lg`}>
                  <p className="text-sm font-medium text-gray-600">License Plate</p>
                  <p className="mt-1 text-lg font-bold text-gray-800">{data.plate || 'N/A'}</p>
                </div>
                <div className="sm:col-span-2 p-4 border-l-4 border-blue-400 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Timestamp</p>
                  <p className="mt-1 text-lg font-bold text-gray-800">{data.time || '-'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
