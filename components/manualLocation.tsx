import { useState } from "react";

export default function ManualLocation({ error, setError }) {
      const [longitude, setLongitude] = useState<string | undefined>();
      const [latitude, setLatitude] = useState<string | undefined>();
    
    return (
        <div className="flex h-dvh items-center justify-center px-8">
            <div className="md:w-1/2">
                <p className="text-[25px] font-medium">🌎 Error accessing device location.</p>
                <p className="mt-2 text-white/80">
                    Check location permissions. Or manually input latitude & longitude. Error: {error}
                </p>
                <Input placeholder="Enter Latitude" onChange={(e) => setManualLatitude(e.target.value)} />
                <Input placeholder="Enter Longitude" onChange={(e) => setLatitude(e.target.value)} />

                <div
                    className="mt-4 flex w-40 cursor-pointer items-center justify-center rounded-md border-2 border-white/50 bg-[#1fa95d] py-2 font-medium"
                    onClick={() => {
                        setManualLocation(parseFloat(latitude || '0'), parseFloat(longitude || '0'));
                        setError(null);
                    }}
                >
                    Submit location
                </div>
            </div>
        </div>
    )
}