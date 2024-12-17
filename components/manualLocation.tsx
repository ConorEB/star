import { useState } from "react";
import Button from "./ui/button";

export default function ManualLocation({ error, setError }) {
    const [longitude, setLongitude] = useState<string | undefined>();
    const [latitude, setLatitude] = useState<string | undefined>();

    return (
        <div className="flex h-dvh items-center justify-center px-8">
            <div className="md:w-1/2">
                <p className="text-lg font-medium">🌎 Error accessing device location.</p>
                <p className="mt-2 text-white/80">
                    Check location permissions. Or manually input latitude & longitude. Error: {error}
                </p>
                <Input placeholder="Enter Latitude" onChange={(e) => setManualLatitude(e.target.value)} />
                <Input placeholder="Enter Longitude" onChange={(e) => setLatitude(e.target.value)} />

                <Button
                    text="Submit Location"
                    onClick={() => {
                        setManualLocation(parseFloat(latitude || '0'), parseFloat(longitude || '0'));
                        setError(null);
                    }}
                    bgColor="bg-blue"
                />
            </div>
        </div>
    )
}