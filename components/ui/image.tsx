import Image from 'next/image';

export default function CustomImage({ src, className, width, height, alt, priority }) {
    return (
        <Image
            src={src}
            className={`rounded-md border-2 border-white/80 ${className}`}
            width={width}
            height={height}
            alt={alt}
            priority={priority}
        />
    );
}