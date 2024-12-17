'use client';

import Image from '@/components/ui/image';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Link from '@/components/ui/link';

import { useSatellite } from '@/hooks/useSatellite';
import { usePermissions } from '@/hooks/usePermissions';
import { useMotion } from '@/hooks/useMotion';
import { useTracking } from '@/hooks/useTracking';

import LocationError from '@/components/manualLocation';
import Error from '@/components/error';
import ManualLocation from '@/components/manualLocation';
import DirectionGuide from '@/components/directionGuide';
import Input from '@/components/ui/input';
import Loader from '@/components/ui/loader';
import PermissionRequest from '@/components/permissionRequest';
import { formatDate } from '@/lib/utils';
import Button from '@/components/ui/button';

function FindSatellite() {
  // Query params for satellite ID
  const searchParams = useSearchParams();
  const satelliteId = searchParams.get('satelliteId');

  // Error states
  const [showManualLocation, setShowManualLocation] =
    useState<boolean>(false);
  const [showTrackingData, setShowTrackingData] = useState(true);

  // Custom hooks
  const { satData, error: satDataError } = useSatellite(satelliteId);
  const {
    permissionGranted,
    requestPermission,
    error: permissionError,
  } = usePermissions();
  const {
    motionData,
    error: locationError,
    setError: setLocationError,
    setManualLocation,
  } = useMotion(permissionGranted);
  const { trackingStatus, satPosition } = useTracking(
    motionData,
    satData,
  );

  // Display error UI for several possible errors that we can't recover from (I.E. user rejects permission to use motion data)
  if (permissionError) return <Error error={permissionError} />;
  if (satDataError) return <Error error={satDataError} />;

  // Show manual inputs for latitude/longitude if error fetching device location
  // @TODO fix this
  if (showManualLocation) {
    return (
      <ManualLocation
        error={locationError}
        setError={setLocationError}
        setManualLocation={setManualLocation}
      />
    );
  }

  // If permission not granted, show permission request UI
  if (!permissionGranted) {
    return (
      <PermissionRequest requestPermission={requestPermission} />
    );
  }

  // Show loader until satellite position has been calculated and tracking status is available
  if (satPosition.azimuth == 0) {
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

          <Button
            text={showTrackingData ? 'Hide Data' : 'Show Data'}
            onClick={() => setShowTrackingData(!showTrackingData)}
            bgColor="bg-primary-green"
          />
        </div>

        {showTrackingData && (
          <>
            <p className="mt-6 text-[20px] font-semibold">
              {satData.name}
            </p>

            <div>
              {'Next Pass: '}
              {formatDate(trackingStatus.nextPass) ||
                'Calculating...'}
            </div>

            <p>Azimuth: {satPosition.azimuth.toFixed(2)}°</p>
            <p>Elevation: {satPosition.elevation.toFixed(2)}°</p>
            <p>
              Azimuth Difference:{' '}
              {trackingStatus.azimuthDifference.toFixed(1)}°
            </p>
            <p>
              Elevation Difference:{' '}
              {trackingStatus.elevationDifference.toFixed(1)}°
            </p>

            <div className="mt-4 h-[2px] w-full rounded-full bg-white/50" />
          </>
        )}

        <div>
          <p
            className={`${trackingStatus.connected ? 'text-[#00ff73]' : 'text-red-500'} mt-4 font-medium`}
          >
            {trackingStatus.connected ? 'CONNECTED' : 'LOST SIGNAL'}
          </p>

          <p className="pt-1">{trackingStatus.message}</p>
        </div>

        <div className="mt-12 flex items-center justify-center gap-10">
          <DirectionGuide trackingStatus={trackingStatus} />
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
