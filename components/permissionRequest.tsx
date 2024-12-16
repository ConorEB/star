import Image from "next/image";

export default function PermissionRequest({
  requestPermission,
}) {
  return (
    <div className="flex h-dvh items-center justify-center px-8">
      <div className="md:w-1/2">
        <p className="text-[25px] font-medium">
          🚀 Device Motion & Location Needed
        </p>
        <p className="mt-2 text-white/80">{`I need to access your device's motion sensors like the gyroscope and location to be able to tell you where to point your phone (and antenna) at the satellite.`}</p>
        <div
          className="mt-4 flex w-40 cursor-pointer items-center justify-center rounded-md border-2 border-white/50 bg-blue-600 py-2 font-medium duration-150 hover:translate-y-[-2px]"
          onClick={() => requestPermission()}
        >
          Continue
        </div>

        <p className="mt-6 text-white/80">
          PS: After clicking the above button, your device will prompt you to
          confirm like the image below. Please press yes!
        </p>
        <Image
          priority={true}
          src="/images/motion-request.png"
          width={250}
          height={250}
          className="mt-4 rounded-md border-2 border-white/80"
          alt="Motion Permission"
        />
      </div>
    </div>
  );
}
