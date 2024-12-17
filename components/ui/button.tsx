export default function Button({ text, onClick, bgColor }) {
  return (
    <div
      className={`${bgColor} mt-4 flex w-40 cursor-pointer items-center justify-center rounded-md border-2 border-light-gray py-2 font-medium hover:border-white/90 hover:translate-y-[-2px] duration-150`}
      onClick={onClick}
    >
      {text}
    </div>
  );
}
