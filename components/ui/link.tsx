import * as NextLink from 'next/link';

export default function Link({ href, children, className, animate }) {
  return (
    <NextLink
      href={href}
      className={`${className} ${animate && 'hover:translate-y-[-2px] duration-150 hover:border-white/90'}`}
    >
      {children}
    </NextLink>
  );
}
