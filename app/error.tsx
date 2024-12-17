'use client';

import ErrorPanel from "@/components/errorPanel";

export default function ErrorPage({ error }) {
    return (
        <ErrorPanel error={error} />
    )
}