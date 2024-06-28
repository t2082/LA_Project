"use client"
import { useLoading } from "@/app/hook/useLoading";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
export default function PauseLoad({ _string }: any) {
    const pathname = usePathname();
    const { setLoading } = useLoading();
    useEffect(() => {

        const currentPath = decodeURIComponent(pathname).split('/').pop();
        if (_string == currentPath) {
            setLoading(false);
        }
    }, [pathname]);

    return (<></>);
}