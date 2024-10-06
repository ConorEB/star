import { RotatingLines } from "react-loader-spinner";

export default function Loader() {
    return (
        <div className='flex justify-center items-center h-dvh px-8'>
            <RotatingLines
                strokeColor="white"
                strokeWidth="3"
                animationDuration="0.75"
                width="25"
                visible={true}
            />
        </div>
    )
}