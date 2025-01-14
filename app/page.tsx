import Image from '@/components/ui/image';
import Link from '@/components/ui/link';

export default function Page() {
  return (
    <div className="flex h-dvh flex-row items-center justify-center px-8">
      <div className="md:w-1/2">
        <p className="w-full text-2xl font-semibold">🛰️ STAR</p>
        <p className="mt-3 text-md">
          Satellite Tracking and Alignment Resource
        </p>

        <p className="mt-3 text-white/80 md:mr-10">
          {`A easy to use web app to align your antenna with any satellite using your phone's motion sensors and location. View the code on `}

          <Link
            href="https://github.com/ConorEB/star"
            className="text-purple"
          >
            GitHub
          </Link>
        </p>

        <div className="mt-3 text-blue-secondary">
          <Link href="/find?satelliteId=25544">
            Try a demo with the ISS ➜
          </Link>
        </div>

        {/* Using html form here to keep it server side rendered */}
        <form
          className="mt-5 flex flex-wrap items-center gap-4"
          action="/find"
          method="get"
        >
          {/* Use normal input and other HTML tags for client rendered form (keeps it server side rendered) */}
          <input
            className="h-12 w-48 rounded-md border-2 border-white/80 bg-dark-gray pl-2 text-white"
            type="text"
            placeholder="Enter NORAD ID"
            inputMode="numeric"
            required
          />
          <button
            type="submit"
            className="flex h-12 w-48 items-center justify-center rounded-md border-2 border-white/50 bg-[#1fa95d] font-medium duration-150 hover:translate-y-[-2px] hover:cursor-pointer hover:border-white/90"
          >
            Find Satellite ➜
          </button>
        </form>

        <Link
          href="/guide"
          className="mt-4 flex h-12 w-48 items-center justify-center rounded-md border-2 border-light-gray bg-black font-medium"
          animate
        >
          User Guide
        </Link>
      </div>

      {/* These images are hidden on mobile devices */}
      <div className="hidden flex-row gap-6 md:flex">
        <Image
          src="/images/weather.png"
          className="rounded-md border-2 border-white/80"
          width={200}
          height={150}
          alt="Satellite image of the weather"
        />
        <Image
          src="/images/demoUI.png"
          className="rounded-md border-2 border-white/80"
          width={150}
          height={150}
          alt="Screenshot of the demo UI"
        />
      </div>
    </div>
  );
}
