'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { useSatellite } from '@/hooks/useSatellite';
import { usePermissions } from '@/hooks/usePermissions';
import { useMotion } from '@/hooks/useMotion';
import { useTracking } from '@/hooks/useTracking';

import { formatDate } from '@/lib/utils';

import ManualLocation from '@/components/manualLocation';
import DirectionGuide from '@/components/directionGuide';
import Loader from '@/components/ui/loader';
import PermissionRequest from '@/components/permissionRequest';
import Button from '@/components/ui/button';
import Link from '@/components/ui/link';
import ErrorPanel from '@/components/errorPanel';

function FindSatellite() {
  // Query params for satellite ID
  const searchParams = useSearchParams();
  const satelliteId = searchParams.get('satelliteId');

  // Local states
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
  if (permissionError) return <ErrorPanel error={permissionError} />;
  if (satDataError) return <ErrorPanel error={satDataError} />;

  // Show manual inputs for latitude/longitude if error fetching device location
  if (locationError) {
    return (
      <ManualLocation
        error={locationError}
        setError={setLocationError}
        setManualLocation={setManualLocation}
      />
    );
  }

  // If permission not granted, show permission request UI (if perrmison rejected, erorr will be returned above)
  if (!permissionGranted) {
    return (
      <PermissionRequest requestPermission={requestPermission} />
    );
  }

  // Show loader until tracking staus and satellite position have been calculated
  if (!trackingStatus.nextPass || satPosition.azimuth === 0) {
    return <Loader />;
  }

  return (
    <div className="flex h-dvh flex-row items-center justify-center px-8">
      <div className="w-full">
        <div className="flex gap-4 items-center">
          <Link
            href="/"
            className="flex py-2 mt-4 w-24 cursor-pointer items-center justify-center rounded-md border-2 border-light-gray bg-dark-gray font-medium"
            animate
          >
            ← Back
          </Link>

          <Button
            text={showTrackingData ? 'Hide Data' : 'Show Data'}
            onClick={() => setShowTrackingData(!showTrackingData)}
            className="bg-blue"
          />
        </div>

        {showTrackingData && (
          <>
            <p className="mt-6 text-md font-semibold">
              {satData.name}
            </p>

            <p>{`Next Pass: ${formatDate(trackingStatus.nextPass)}`}</p>

            <p>Azimuth: {satPosition.azimuth.toFixed(2)}°</p>
            <p>Elevation: {satPosition.elevation.toFixed(2)}°</p>
            <p>{`Azimuth Difference: ${trackingStatus.azimuthDifference.toFixed(1)}°`}</p>
            <p>{`Elevation Difference: ${trackingStatus.elevationDifference.toFixed(1)}°`}</p>

            <div className="flex-grow mt-4 h-[2px] w-full rounded-full bg-light-gray" />
          </>
        )}

        <div>
          <p
            className={`${trackingStatus.connected ? 'text-green-secondary' : 'text-red'} mt-4 font-medium`}
          >
            {trackingStatus.connected ? 'CONNECTED' : 'LOST SIGNAL'}
          </p>

          <p className="pt-1">{trackingStatus.message}</p>
        </div>

        <DirectionGuide trackingStatus={trackingStatus} />
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
