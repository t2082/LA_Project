"use client"
import { useLoading } from "@/app/hook/useLoading";
import { Button } from "@/components/ui/button";
import { CircleCheckBig } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function(){

    const route = useRouter()

    const onMyOrder = () => {
        setLoading(true);
        route.push('/my-order')
    } 

    const { setLoading } = useLoading();

    const pathname = usePathname();

    useEffect(() => {
        const expectedPageName = 'order-confirmation';
        const currentPath = decodeURIComponent(pathname).split('/').pop();
        if (expectedPageName == currentPath) {
            setLoading(false);
        }
    }, [pathname]);

    return (
        <>
            <div className="flex justify-center items-center my-32 ">
                <div className="flex flex-col items-center justify-center border p-28 rounded-2xl shadow gap-3">
                    <CircleCheckBig className="font-extrabold text-green-700 w-[140px] h-[140px]"/>
                    <h2 className="font-bold text-4xl text-green-700">Order Successfully !</h2>
                    <h2 className="text-xl">Thank you so much for order</h2>
                    <Button className="bg-blue-800 text-white hover:bg-blue-900 text-base mt-10" onClick={() => onMyOrder()}>Track your order</Button>
                </div>
            </div>
        </>
    )
}