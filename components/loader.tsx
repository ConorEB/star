import { RotatingLines } from "react-loader-spinner";

export default function Loader() {
    return (
        <RotatingLines
            strokeColor="white"
            strokeWidth="3"
            animationDuration="0.75"
            width="25"
            visible={true}
        />
    )
}