import { RotatingLines } from 'react-loader-spinner';

export default function Loader() {
  return (
    <div className="flex h-dvh items-center justify-center px-8">
      <RotatingLines
        strokeColor="white"
        strokeWidth="3"
        animationDuration="0.75"
        width="25"
        visible
      />
    </div>
  );
}
