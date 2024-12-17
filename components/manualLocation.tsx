import { useState } from 'react';
import Button from './ui/button';
import Input from './ui/input';

interface ManualLocationProps {
  error: string;
  setError: (error: string | null) => void;
  setManualLocation: (latitude: number, longitude: number) => void;
}

export default function ManualLocation({
  error,
  setError,
  setManualLocation,
}: ManualLocationProps) {
  const [latitude, setLatitude] = useState<string | undefined>();
  const [longitude, setLongitude] = useState<string | undefined>();

  return (
    <div className="flex h-dvh items-center justify-center px-8">
      <div className="md:w-1/2">
        <p className="text-lg font-medium">
          🌎 Error accessing device location.
        </p>
        <p className="mt-2 text-white/80">
          Check location permissions. Or manually input latitude &
          longitude. Error: {error}
        </p>

        <Input
          placeholder="Enter Latitude"
          onChange={(e) => setLatitude(e.target.value)}
        />
        <Input
          placeholder="Enter Longitude"
          onChange={(e) => setLongitude(e.target.value)}
        />

        <Button
          text="Submit Location"
          onClick={() => {
            setManualLocation(
              parseFloat(latitude ?? '0'),
              parseFloat(longitude ?? '0'),
            );
            setError(null);
          }}
          className="bg-blue"
        />
      </div>
    </div>
  );
}
