import Link from 'next/link';

interface CustomLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export default function CustomLink({
  href,
  children,
  className = '', // default value is an empty string since no extra styles are being applied
  animate = false,
}: CustomLinkProps) {
  return (
    <Link
      href={href}
      className={`${className} ${animate && 'hover:translate-y-[-2px] duration-150 hover:border-white/90'}`}
    >
      {children}
    </Link>
  );
}
