import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
      <div className='h-dvh flex flex-row justify-center items-center px-8'>
        <div className='md:w-1/2'>
          <p className='font-semibold text-[40px] w-full'>🛰️ STAR</p>
          <p className='mt-2 text-[20px]'>Satellite Tracking and Alignment Resource</p>
          <p className='mt-2 text-white/80 md:mr-10'>{`A easy to use web app to align your antenna with any satellite using your phone's motion sensors and location.`}</p>

          <form className='flex flex-wrap items-center gap-4 mt-6' action='/find' method='get'>
            <input
              className='pl-2 h-12 w-48 rounded-md text-white6 bg-gray-800 border-2 border-white/80 text-white'
              type='text'
              name='satelliteId'
              inputMode='numeric'
              placeholder='Enter NORAD ID'
              required
            />
            <button
              type='submit'
              className='bg-[#1fa95d] font-medium rounded-md w-48 h-12 flex justify-center items-center border-white/50 hover:border-white/90 border-2 hover:cursor-pointer hover:translate-y-[-2px] duration-150'
            >
              Find Satellite ➜
            </button>
          </form>

          <Link href={'/guide'} className='bg-black border-white/50 border-2 font-medium rounded-md w-48 h-12 mt-4 flex justify-center hover:border-white/80 items-center hover:cursor-pointer hover:translate-y-[-2px] duration-150'>User Guide</Link>
        </div>

        <div className='flex-row gap-6 hidden md:flex'>
          <Image src={'/weather.png'} className='rounded-md border-2 border-white/80' width={200} height={150} alt='Antenna' />
          <Image src={'/guide.png'} className='rounded-md border-2 border-white/80' width={150} height={150} alt='Antenna' />
        </div>
      </div>
  );
}