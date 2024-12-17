import Link from "./ui/link";

export default function Error({ error }) {
  return (
    <div className="flex h-dvh items-center justify-center">
      <div className="px-8 md:w-1/2">
        <p className="text-lg font-medium">
          👎 There was an error.
        </p>
        <p className="mt-2 text-white/80">{error}</p>
        <Link
          href="/"
          className="mt-4 flex w-40 cursor-pointer items-center justify-center rounded-md border-2 border-light-gray bg-blue py-2 font-medium"
          animate={true}
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}
