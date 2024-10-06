import Image from "next/image";
import Link from "next/link";

function Guide() {
    return (
        <div className="h-dvh w-full flex justify-center">
            <div className="md:w-2/3 px-8">
                <Link href={'/'} className='bg-gray-800 border-2 mt-16 border-white/50 w-24 py-1 font-medium rounded-md flex items-center justify-center cursor-pointer hover:translate-y-[-2px] duration-150'>
                    ← Back
                </Link>

                <p className="text-white/80 pt-4 font-medium text-[20px]">Introduction.</p>
                <div className="w-40 h-[2px] bg-white/30 rounded-full mt-1 mb-1" />

                <p className="pt-4">{`STAR is a web interface that uses your device's motion sensors to align your phone (and antenna) with a specified satellite. It was designed and developed for both beginners and advanced users - employing a similar to design language to`} <Link href={'https://support.apple.com/en-us/101573'} className="text-blue-300">{`Apple's satellite SOS`}</Link></p>

                <div className='gap-4 flex flex-wrap flex-row pt-4'>
                    <Image src={'/weather.png'} className='rounded-md border-2 border-white/80' width={200} height={200} alt='Weather' />
                    <Image src={'/weather-2.jpeg'} className='rounded-md border-2 border-white/80' width={200} height={200} alt='Weather' />
                </div>
                
                <p className="text-white/80 pt-6 font-medium text-[20px]">Getting started.</p>
                <div className="w-40 h-[2px] bg-white/30 rounded-full mt-1 mb-1" />

                <p className="pt-4">{`To start, you'll have to input the NORAD ID for the satellite you want to track. You can lookup the ID by the name of the satellite here:`} <Link className='text-blue-300' href={'https://www.n2yo.com/database/'}>https://www.n2yo.com/database/</Link></p>

                <p className="pt-4">{`You'll then be prompted to share your device's motion data. This is needed to align the antenna/device with the satellite. After clicking yes, you should now see a screen similar to below:`}</p>

                <Image src={'/guide.png'} className='rounded-md border-2 border-white/80 mt-4' width={175} height={175} alt='Antenna' />

                <p className="pt-4">{`That's it! Hold your device on the same plane as your antenna to align it with the satellite. I personally use a handheld yagi and a iPhone MagSafe magnet clamp that allows me to get precise results without having to hold both the antenna and phone.`}</p>

                <p className="text-white/80 pt-6 font-medium text-[20px]">FAQ.</p>
                <div className="w-40 h-[2px] bg-white/30 rounded-full mt-1 mb-1" />
                <p className="pt-4">Can I use this on a computer?</p>
                <p className="text-white/70">{`Unfortunately not. You need motion sensors which computers don't share.`}</p>

                <p className="pt-4">I have an issue/bug to report</p>
                <p className="text-white/70">Sorry about that, STAR is still a work in progress. Please let me know using the email below!</p>

                <div className="w-40 h-[2px] bg-white/30 rounded-full mb-1 mt-8" />
                <p className="pt-2 pb-12">Made with ❤️ by Conor Ebeling. You can contact me at <a className="text-blue-300" href="mailto:hey@conor.link">hey@conor.link</a></p>
            </div>
        </div>
    )
}

export default Guide;