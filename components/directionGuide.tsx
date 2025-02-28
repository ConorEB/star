import { translateElevation } from '@/lib/utils';
import { TrackingStatus } from '@/types/oritentation';

function DirectionGuide({
  trackingStatus,
}: {
  trackingStatus: TrackingStatus;
}) {
  return (
    <div className="mt-8 flex items-center justify-center gap-10">
      <div className="flex items-center justify-center">
        <div
          className="absolute w-28 h-28 z-20 transform -translate-x-1/2"
          style={{
            transform: `rotate(${(trackingStatus.azimuthDifference - 55).toFixed(1)}deg) translateX(100%)`, // 55 deg is the calculated offset
          }}
        >
          <div className="flex items-center">
            <div className="h-1 w-3 bg-white rounded-md" />
            <div className="h-4 w-4 bg-white rounded-full mx-1 shadow-2xl" />
            <div className="h-1 w-3 bg-white rounded-md" />
          </div>
        </div>

        <div className="w-48 h-48 absolute">
          <div
            className="w-full h-full border-b-4 border-l-4 border-r-4 border-green-secondary rounded-full shadow-2xl"
            style={{
              clipPath: 'polygon(50% 0%, 100% 100%, 33% 100%)',
              transform: 'rotate(197deg)',
            }}
          />
        </div>

        <div className="border-4 border-light-gray rounded-full h-48 w-48 flex items-center justify-center overflow-clip">
          <div className="triangle bg-green-secondary/70 mb-40 animate-pulse border-4" />
          <div className="bg-green-secondary h-12 w-12 rounded-full absolute z-10 shadow-2xl" />
        </div>
      </div>

      <div className="flex flex-row items-center justify-center gap-4">
        <div className="border-2 border-dashed border-light-gray w-0 h-44 bg-transparent" />
        <div className="w-4 rounded-sm bg-[#a3a3a3] absolute h-[2px]" />
        <div
          className={`w-7 rounded-sm ${Math.abs(trackingStatus.elevationDifference) < 15 ? 'bg-green-secondary' : 'bg-red'} absolute h-1`}
          style={{
            translate: `0px ${translateElevation(trackingStatus.elevationDifference).toFixed(0)}px`,
          }}
        />
      </div>
    </div>
  );
}

export default DirectionGuide;
