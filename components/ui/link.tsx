import Link from 'next/link';

export default function CustomLink({ href, children, className, animate }) {
  return (
    <Link
      href={href}
      className={`${className} ${animate && 'hover:translate-y-[-2px] duration-150 hover:border-white/90'}`}
    >
      {children}
    </Link>
  );
}
