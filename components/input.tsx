'use static';

export default function Input({ placeholder, inputMode, onChange, required }) {
    return (
        <input
            className='pl-2 h-12 w-48 rounded-md text-white6 bg-gray-800 border-2 border-white/80 text-white'
            type='text'
            inputMode={inputMode}
            placeholder={placeholder}
            onChange={onChange}
            required={required}
        />
    )
}