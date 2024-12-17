interface ButtonProps {
  text: string;
  onClick: () => void;
  className: string;
}

export default function Button({
  text,
  onClick,
  className,
}: ButtonProps) {
  return (
    <div
      className={`mt-4 flex w-40 cursor-pointer items-center justify-center rounded-md border-2 border-light-gray py-2 font-medium hover:border-white/90 hover:translate-y-[-2px] duration-150 ${className}`}
      onClick={onClick}
    >
      {text}
    </div>
  );
}
