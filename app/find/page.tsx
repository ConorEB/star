'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { useSatellite } from '@/hooks/useSatellite';
import { usePermissions } from '@/hooks/usePermissions';
import { useMotion } from '@/hooks/useMotion';

import LocationError from '@/components/manualLocation';
import Error from '@/components/error';

import ManualLocation from '@/components/manualLocation';
import DirectionGuide from '@/components/directionGuide';
import Input from '@/components/ui/input';
import Loader from '@/components/ui/loader';
import PermissionRequest from '@/components/permissionRequest';
import { formatDate } from '@/lib/utils';
import { useConnection } from '@/hooks/useConnection';

function FindSatellite() {
  // Query params for satellite ID
  const searchParams = useSearchParams();
  const satelliteId = searchParams.get('satelliteId');

  // Error states
  const [showManualLocation, setShowManualLocation] = useState<boolean>(false);

  // Local states
  const [showData, setShowData] = useState(true);

  // Custom hooks
  const { permissionGranted, requestPermission, error: permissionError } = usePermissions();

  const { motionData, error: locationError, setMotionData } = useMotion(permissionGranted);
  if (locationError) { setShowManualLocation(true); } // if error with location fetch, show page to manually input location

  const { satData, fetchSatelliteData, setSatData, error: satDataError } = useSatellite(
    satelliteId,
    motionData,
    );

  const { connectionStatus } = useConnection(motionData, satData, setSatData);

  // Fetch satellite data on permission granted
  useEffect(() => {
    if (permissionGranted) {
      fetchSatelliteData();
    }
  }, [permissionGranted]);

  // Display error UI for several possible errors that we can't recover from (I.E. user rejects permission to use motion data)
  if (permissionError) return <Error error={permissionError} />;
  if (satDataError) return <Error error={satDataError} />;

  // If permission not granted, show permission request UI
  if (!permissionGranted) {
    return (
      <PermissionRequest requestPermission={requestPermission} />
    );
  }

  // Show manual inputs for latitude/longitude if error fetching device location
  if (showManualLocation) {
    return (
      <ManualLocation
        error={locationError}
        setMotionData={setMotionData}
        setShowManualLocation={setShowManualLocation}
      />
    );
  }

  // Show loader until satellite position has been calculated
  if (!satData.position) {
    return <Loader />;
  }

  return (
    <div className="flex h-dvh flex-row items-center justify-center px-8">
      <div>
        <div className="flex gap-4">
          <Link
            href="/"
            className="flex w-24 cursor-pointer items-center justify-center rounded-md border-2 border-white/50 bg-gray-800 py-1 font-medium hover:translate-y-[-2px]"
          >
            ← Back
          </Link>
          <div
            className="flex w-32 cursor-pointer items-center justify-center rounded-md border-2 border-white/50 bg-blue-600 py-1 font-medium hover:translate-y-[-2px]"
            onClick={() => setShowData(!showData)}
          >
            {showData ? 'Hide Data' : 'Show Data'}
          </div>
        </div>

        {showData && (
          <>
            <p className="mt-6 text-[20px] font-semibold">{satData.name}</p>

            <div>
              {'Next Pass: '}
              {formatDate(satData.nextPass) || 'Calculating...'}
            </div>

            <p>Azimuth: {satData.position.azimuth.toFixed(2)}°</p>
            <p>Elevation: {satData.position.elevation.toFixed(2)}°</p>
            <p>Azimuth Difference: {satData.azimuthDifference.toFixed(1)}°</p>
            <p>Elevation Difference: {satData.elevationDifference.toFixed(1)}°</p>

            <div className="mt-4 h-[2px] w-full rounded-full bg-white/50" />
          </>
        )}

        <div>
          <p className={`${connectionStatus.connected ? 'text-[#00ff73]' : 'text-red-500'} mt-4 font-medium`}>
            {connectionStatus.connected ? 'CONNECTED' : 'LOST SIGNAL'}
          </p>

          <p className="pt-1">{connectionStatus.message}</p>
        </div>

        <div className="mt-12 flex items-center justify-center gap-10">
          <DirectionGuide satData={satData} />
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loader />}>
      <FindSatellite />
    </Suspense>
  );
}