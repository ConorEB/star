export default function Header({ title }) {
    return (
        <>
            <p className="pt-4 text-md font-medium text-white/80">
                {title}
            </p>
            <div className="my-1 h-[2px] w-40 rounded-full bg-white/30" />
        </>
    )
}