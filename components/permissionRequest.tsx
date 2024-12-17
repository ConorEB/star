import Image from '@/components/ui/image';
import Button from './ui/button';

interface PermissionRequestProps {
  requestPermission: () => Promise<void>; // function passed from usePermissions.ts to request permission from web API
}

export default function PermissionRequest({
  requestPermission,
}: PermissionRequestProps) {
  return (
    <div className="flex h-dvh items-center justify-center px-8">
      <div className="md:w-1/2">
        <p className="text-lg font-medium">
          🚀 Device Motion & Location Needed
        </p>
        <p className="mt-2 text-white/80">{`I need to access your device's motion sensors like the gyroscope and location to be able to tell you where to point your phone (and antenna) at the satellite.`}</p>
        <Button
          text="Continue"
          onClick={() => requestPermission()}
          className="bg-blue"
        />

        <p className="mt-6 text-white/80">
          PS: After clicking the above button, your device will prompt
          you to confirm like the image below. Please press yes!
        </p>
        <Image
          priority
          src="/images/motionRequest.png"
          width={250}
          height={250}
          className="mt-4 rounded-md border-2 border-white/80"
          alt="Example image of a request to access device motion data"
        />
      </div>
    </div>
  );
}
