import * as NextLink from "next/link"

export default function Link ({ href, children, className }) {
    return (
        <NextLink
            href={href}
            className={className}
        >
            {children}
        </NextLink>
    )
}