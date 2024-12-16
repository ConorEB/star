'use static';

export default function Input({ placeholder, inputMode, onChange, required }) {
  return (
    <input
      className="h-12 w-48 rounded-md border-2 border-white/80 bg-gray-800 pl-2 text-white"
      type="text"
      inputMode={inputMode}
      placeholder={placeholder}
      onChange={onChange}
      required={required}
    />
  );
}
