const SatelliteComponent = ({ azimuthDifference }) => {
    return (
        <div className="flex items-center justify-center">
            <div
                className='absolute w-28 h-28 z-10 transform -translate-x-1/2'
                style={{
                    transform: `rotate(${azimuthDifference.toFixed(1) - 55}deg) translateX(100%)`,
                }}
            >
                <div className='flex items-center'>
                    <div className="h-1 w-3 bg-white rounded-md"></div>
                    <div className="h-4 w-4 bg-white rounded-full mx-1 shadow-2xl"></div>
                    <div className="h-1 w-3 bg-white rounded-md"></div>
                </div>

            </div>

            <div className="border-4 border-gray-600 rounded-full h-48 w-48 flex items-center justify-center overflow-clip relative">
                <div className={`triangle bg-[#00ff73]/70 mb-40 animate-pulse`}></div>
                <div className='bg-[#00ff73] h-12 w-12 rounded-full absolute z-10 shadow-2xl'></div>
            </div>
        </div>
    );
};

export default SatelliteComponent;