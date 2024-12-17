'use static';

interface InputProps {
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputMode?: 'text' | 'numeric'; // these are the only two input modes used in the app
}

export default function Input({
  placeholder,
  onChange,
  inputMode,
}: InputProps) {
  return (
    <input
      className="h-12 w-48 rounded-md border-2 border-white/80 bg-dark-gray pl-2 text-white"
      type="text"
      inputMode={inputMode ?? 'text'}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
}
