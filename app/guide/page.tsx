import Image from 'next/image';
import Link from 'next/link';

export default function Guide() {
  return (
    <div className="flex h-dvh w-full justify-center">
      <div className="px-8 md:w-2/3">
        <Link
          href="/"
          className="mt-16 flex w-24 cursor-pointer items-center justify-center rounded-md border-2 border-white/50 bg-gray-800 py-1 font-medium duration-150 hover:translate-y-[-2px]"
        >
          ← Back
        </Link>

        <p className="pt-4 text-[20px] font-medium text-white/80">
          Introduction.
        </p>
        <div className="my-1 h-[2px] w-40 rounded-full bg-white/30" />

        <p className="pt-4">
          {`STAR is a web interface that uses your device's motion sensors to align your phone (and antenna) with a specified satellite. It was designed and developed for both beginners and advanced users - employing a similar design language to`}{' '}
          <Link
            href="https://support.apple.com/en-us/101573"
            className="text-blue-300"
          >{`Apple's satellite SOS`}</Link>
        </p>

        <div className="flex flex-row flex-wrap gap-4 pt-4">
          <Image
            src="/images/weather.png"
            className="rounded-md border-2 border-white/80"
            width={200}
            height={200}
            alt="Weather"
          />
          <Image
            src="/images/in-use.png"
            className="rounded-md border-2 border-white/80"
            width={200}
            height={200}
            alt="Weather"
          />
        </div>

        <p className="pt-6 text-[20px] font-medium text-white/80">
          Getting started.
        </p>
        <div className="my-1 h-[2px] w-40 rounded-full bg-white/30" />

        <p className="pt-4">
          {`To start, you'll have to input the NORAD ID for the satellite you want to track. You can lookup the ID by the name of the satellite here:`}{' '}
          <Link
            className="text-blue-300"
            href="https://www.n2yo.com/database/"
          >
            https://www.n2yo.com/database/
          </Link>
        </p>

        <p className="pt-4">{`You'll then be prompted to share your device's motion data. This is needed to align the antenna/device with the satellite. After clicking yes, you should now see a screen similar to below:`}</p>

        <Image
          src="/images/demo-ui.png"
          className="mt-4 rounded-md border-2 border-white/80"
          width={175}
          height={175}
          alt="Antenna"
        />

        <p className="pt-4">{`That's it! Hold your device on the same plane as your antenna to align it with the satellite. I personally use a handheld yagi and a iPhone MagSafe magnet clamp that allows me to get precise results without having to hold both the antenna and phone.`}</p>

        <p className="pt-6 text-[20px] font-medium text-white/80">
          FAQ.
        </p>
        <div className="my-1 h-[2px] w-40 rounded-full bg-white/30" />
        <p className="pt-4">Can I use this on a computer?</p>
        <p className="text-white/70">{`Unfortunately not. You need motion sensors which computers don't share as web APIs.`}</p>

        <p className="pt-4">I have an issue/bug to report</p>
        <p className="text-white/70">
          Sorry about that, STAR is still a work in progress. Please
          let me know using the email below!
        </p>

        <div className="mb-1 mt-8 h-[2px] w-40 rounded-full bg-white/30" />
        <p className="pb-12 pt-2">
          Made by
          <a href="https://conor.link" className="text-blue-300">
            {' Conor Ebeling'}
          </a>
          . You can contact me at
          <a className="text-blue-300" href="mailto:hey@conor.link">
            {' hey@conor.link'}
          </a>
        </p>
      </div>
    </div>
  );
}
