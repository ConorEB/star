import Image from "next/image";
import Link from "next/link";

function Guide() {
    return (
        <div className="h-dvh w-full flex justify-center">
            <div className="md:w-2/3 px-8">
                <p className="text-white/80 pt-16 font-medium text-[20px]">Introduction.</p>
                <div className="w-40 h-[2px] bg-white/30 rounded-full mt-1 mb-1" />

                <p className="pt-2">STAR was designed and developed to be intuitive for both beginners and advanced users with antenna experience. It allows you to use directional antenna's completely handheld and still be very precise.</p>

                <div className=' gap-4 flex pt-4'>
                    <Image src={'/antenna.jpeg'} className='rounded-md border-2 border-white/80' width={175} height={175} alt='Antenna' />
                    <Image src={'/weather.png'} className='rounded-md border-2 border-white/80' width={175} height={175} alt='Antenna' />
                </div>
                
                <p className="text-white/80 pt-6 font-medium text-[20px]">Getting started.</p>
                <div className="w-40 h-[2px] bg-white/30 rounded-full mt-1 mb-1" />

                <p className="pt-4">To start, you'll have to input the NORAD ID for the satellite you want to track. You can lookup the ID by the name of the satellite here: <Link href={'https://www.n2yo.com/database/'}>https://www.n2yo.com/database/</Link></p>

                <p className="pt-4">You'll then be prompted to share your devices motion data. This is needed to align the antenna/device with the satellite. After clicking yes, you should now see a screen similar to below:</p>

                <Image src={'/guide-ui.png'} className='rounded-md border-2 border-white/80 mt-4' width={175} height={175} alt='Antenna' />

                <p className="pt-4">That's it! Hold your device on the same plane as your antenna to align it with the satellite. I personally use a handheld yagi and a iPhone MagSafe magnet clamp that allows me to get precise results without a motorized rotator.</p>

                <p className="text-white/80 pt-6 font-medium text-[20px]">Advanced tools.</p>
                <div className="w-40 h-[2px] bg-white/30 rounded-full mt-1 mb-1" />

                <p className="text-white/80 pt-6 font-medium text-[20px]">FAQ.</p>
                <div className="w-40 h-[2px] bg-white/30 rounded-full mt-1 mb-1" />
                <p>Can I use this on a computer?</p>


                <p className="pt-4">Made with ❤️ by Conor Ebeling. You can contact me at <a href="mailto:hey@conor.link">hey@conor.link</a></p>

                <div className='bg-blue-600 border-2 mt-4 border-white/50 w-32 py-1 font-medium flex items-center justify-center rounded-md cursor-pointer'>
                    Start now
                </div>
            </div>
        </div>
    )
}

export default Guide;