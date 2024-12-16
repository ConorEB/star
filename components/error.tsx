import Link from "next/link";

export default function Error({ error }) {
  return (
    <div className="flex h-dvh items-center justify-center">
      <div className="px-8 md:w-1/2">
        <p className="text-[25px] font-medium">
          👎 There was an error.
        </p>
        <p className="mt-2 text-white/80">{error}</p>
        <Link
          href="/"
          className="mt-4 flex w-40 cursor-pointer items-center justify-center rounded-md border-2 border-white/50 bg-blue-600 py-2 font-medium hover:translate-y-[-2px]"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}
