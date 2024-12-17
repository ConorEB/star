import Image from '@/components/ui/image';
import Input from '@/components/ui/input';
import Link from '@/components/ui/link';

export default function Home() {
  return (
    <div className="flex h-dvh flex-row items-center justify-center px-8">
      <div className="md:w-1/2">
        <p className="w-full text-[40px] font-semibold">🛰️ STAR</p>
        <p className="mt-3 text-[20px]">
          Satellite Tracking and Alignment Resource
        </p>
        <p className="mt-3 text-white/80 md:mr-10">
          {`A easy to use web app to align your antenna with any satellite using your phone's motion sensors and location. Made by `}

          <Link href="https://conor.link" className="text-purple-400">
            Conor
          </Link>
        </p>

        <div className="mt-3 text-blue-300">
          <Link href="/find?satelliteId=25544">
            Try a demo with the ISS ➜
          </Link>
        </div>

        <form
          className="mt-5 flex flex-wrap items-center gap-4"
          action="/find"
          method="get"
        >
          <Input
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
          className="mt-4 flex h-12 w-48 items-center justify-center rounded-md border-2 border-white/50 bg-black font-medium duration-150 hover:translate-y-[-2px] hover:cursor-pointer hover:border-white/80"
        >
          User Guide
        </Link>
      </div>

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
