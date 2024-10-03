'use client';

import { useState } from 'react';

export default function Home() {
  const [satelliteId, setSatelliteId] = useState('');

  return (
    <div className='h-dvh flex flex-row justify-center items-center px-8'>
      <div>
        <p className='font-bold text-[40px] w-full'>🛰️ STAR</p>
        <p className='mt-2 text-[20px]'>Satellite Tracking and Alignment Resource</p>
        <p className='mt-2 text-white/80'>A easy to use web app to align your antenna with any satellite using your phone's motion sensors and location.</p>

        <div className='flex flex-wrap items-center gap-4 mt-6'>
          <input className='pl-2 h-12 w-48 rounded-md text-white6 bg-gray-800 border-2 border-white/50' type='digit' inputMode='numeric' placeholder='Satellite NORAD ID' onChange={(e) => setSatelliteId(e.target.value)} value={satelliteId} />
          <div className='bg-[#217e4b] font-medium rounded-md w-48 h-12 flex justify-center items-center border-white/50 hover:border-white/90 border-2 hover:cursor-pointer hover:translate-y-[-2px] duration-150' onClick={() => window.location.href = '/find/' + satelliteId}>Find Satellite ➜</div>
        </div>

        <div className='bg-black border-white/50 border-2 font-medium rounded-md w-48 h-12 mt-4 flex justify-center hover:border-white/80 items-center hover:cursor-pointer hover:translate-y-[-2px] duration-150'>User Guide</div>
      </div>
    </div>
  );
}