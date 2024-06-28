"use client"
import { useLoading } from "@/app/hook/useLoading";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
export default function PauseLoad({ stringSearch }: any) {
    const pathname = usePathname();
    const { setLoading } = useLoading();
    useEffect(() => {
        const currentPath = decodeURIComponent(pathname).split('/').pop();
        if (stringSearch == currentPath) {
            setLoading(false);
        }
    }, [pathname]);
    return (<></>);
}