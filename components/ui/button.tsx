interface ButtonProps {
  text: string;
  onClick: () => void | Promise<void>;
  className: string;
}

export default function Button({
  text,
  onClick,
  className,
}: ButtonProps) {
  return (
    <button
      className={`mt-4 flex w-40 cursor-pointer items-center justify-center rounded-md border-2 border-light-gray py-2 font-medium hover:border-white/90 hover:translate-y-[-2px] duration-150 ${className}`}
      onClick={() => {
        /* eslint-disable-next-line no-void */
        void onClick(); // Explicitly ignoring the Promise return
      }}
      type="button"
    >
      {text}
    </button>
  );
}
