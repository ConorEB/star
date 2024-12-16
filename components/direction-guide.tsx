export default function DirectionGuide({
  satData,
}: {
  satData: SatelliteData;
}) {
  return (
    <>
      <div className="flex items-center justify-center">
        <div
          className="absolute z-20 size-28 -translate-x-1/2"
          style={{
            transform: `rotate(${(satData.azimuthDifference - 55).toFixed(1)}deg) translateX(100%)`,
          }}
        >
          <div className="flex items-center">
            <div className="h-1 w-3 rounded-md bg-white"></div>
            <div className="mx-1 size-4 rounded-full bg-white shadow-2xl"></div>
            <div className="h-1 w-3 rounded-md bg-white"></div>
          </div>
        </div>

        <div className="absolute size-48">
          <div
            className="size-full rounded-full border-x-4 border-b-4 border-[#00ff73] shadow-2xl"
            style={{
              clipPath: 'polygon(50% 0%, 100% 100%, 33% 100%)',
              transform: 'rotate(197deg)',
            }}
          ></div>
        </div>

        <div className="flex size-48 items-center justify-center text-clip rounded-full border-4 border-gray-600">
          <div
            className={`triangle mb-40 animate-pulse border-4 bg-[#00ff73]/70`}
          ></div>
          <div className="absolute z-10 size-12 rounded-full bg-[#00ff73] shadow-2xl"></div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-center gap-4">
        <div className="h-44 w-0 border-2 border-dashed border-white/50 bg-transparent"></div>
        <div className="absolute h-[2px] w-4 rounded-sm bg-gray-400"></div>
        <div
          className={`w-7 rounded-sm ${Math.abs(satData.elevationDifference) < 15 ? 'bg-[#00ff73]' : 'bg-red-500'} absolute h-1`}
          style={{
            translate: `0px ${calcEleveationTranslate(satData.elevationDifference).toFixed(0)}px`,
          }}
        ></div>
      </div>
    </>
  );
}

const calcEleveationTranslate = (elevation: number) => {
  if (elevation < 0) return elevation / 1.4;
  if (elevation > 0) return elevation / 1.4;
  return 0;
};
