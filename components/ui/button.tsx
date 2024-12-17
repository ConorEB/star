export default function Button({ text, onClick, bgColor }) {
  return (
    <div
      className={`${bgColor} mt-4 flex w-40 cursor-pointer items-center justify-center rounded-md border-2 border-white/50 bg-green py-2 font-medium`}
      onClick={onClick}
    >
      {text}
    </div>
  );
}
