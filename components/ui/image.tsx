import Image from 'next/image';

interface CustomImageProps {
  src: string;
  className: string;
  width: number;
  height: number;
  alt: string;
  priority?: boolean;
}

export default function CustomImage({
  src,
  className,
  width,
  height,
  alt,
  priority,
}: CustomImageProps) {
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
