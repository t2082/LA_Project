"use client"
import globalapi from "@/app/utils_/globalapi";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import formatCurrency from "@/app/utils_/formatCurrency";
import Image from "next/image";
import { EyeIcon } from "lucide-react";
import { useLoading } from "@/app/hook/useLoading";

export default function(){

    let jwt: string | null = null;
    let user: any = {};

    if (typeof window !== 'undefined') {
        jwt = sessionStorage.getItem("jwt");
        user = JSON.parse(sessionStorage.getItem('user') || '{}');
    } else {
        console.log('You are on the server');
        // 👉️ can't use sessionStorage
    }

    const [loaded, setLoaded] = useState(false);
    const { setLoading } = useLoading();

    useEffect(() => {
        if (loaded == false) setLoading(true);
        getMyOrder()
    }, []);

    const [orderList, setOrderList] = useState([]);

    const getMyOrder = async () => {
        if (jwt !== null) {
            const orderList = await globalapi.getOrderByID(user.id, jwt);
            setOrderList(orderList);
            setLoaded(true);
        } else {
            console.error('JWT is null');
            // Handle the error or show a message to the user
        }
    }
    const pathname = usePathname();

    useEffect(()=>{
        const expectedPageName = 'my-order';
        const currentPath = decodeURIComponent(pathname).split('/').pop();
        if (expectedPageName == currentPath && loaded == true) {
            setLoading(false);
        }
    }, [pathname, loaded]); 

    // const id_order = order

    const getDMY = (dateTime:string) => {
        const dateTimeString = dateTime;
        const dateString = dateTimeString.split('T')[0];
        const [year, month, day] = dateString.split('-');
        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate;
    }



    return (
        <div>
            <p className="p-4 bg-blue-600 text-white text-3xl text-center"> My Orders </p>
            <div className="py-5 mx-7 md:mx-20">
                <h1 className="text-blue-800 font-bold text-3xl mb-4 mt-10">Order History:</h1>
                <div>
                    {orderList.map((item, index) =>(
                        <Collapsible key={index} className="mt-5">
                            <CollapsibleTrigger className="w-[80%] shadow-lg">
                                <div className="grid grid-cols-4 p-2 border bg-slate-100 ">
                                    <p><span className="font-bold">Order Date: </span>{getDMY((item as any)?.createdAt)}</p>
                                    <p><span className="font-bold">Total Amount: </span>{formatCurrency.formatCurrencyVN((item as any)?.totalOrderAmount)}</p>
                                    <p><span className="font-bold">Status: </span>{(item as any)?.status}</p>
                                    <div className="text-gray-400 flex gap-3 justify-end">
                                        <p>Click to show</p>
                                        <EyeIcon></EyeIcon>
                                    </div>
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                {
                                    (item as { orderItemList: any[] })?.orderItemList.map((items, index_) =>(
                                        <div key={index_} className="w-[80%]">
                                            <div className="border grid grid-cols-4 p-5">
                                                <div className="flex items-center justify-center">
                                                   <Image src={
                                                        items?.product?.data?.attributes?.images?.data[0]?.attributes?.url}
                                                        unoptimized={true}
                                                        alt={items?.product?.data?.attributes?.name}
                                                        width={100}
                                                        height={100}
                                                        className="h-[100px] w-[100px] object-contain"
                                                    /> 
                                                </div>
                                                
                                                <div className="flex items-center">
                                                    <div>
                                                        <p className="font-bold ">{items?.product?.data?.attributes?.name}</p>
                                                        <p className="">{formatCurrency.formatCurrencyVN(items?.product?.data?.attributes?.price)} / {items?.product?.data?.attributes?.unit}</p>
                                                    </div>
                                                </div>
                                                <p className="flex items-center "><span className="font-bold ">Quantity: </span>&nbsp;{items?.quantity}</p>
                                                <p className="flex items-center "><span className="font-bold ">Total: </span>&nbsp;{formatCurrency.formatCurrencyVN(items?.total)}</p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                </div>
            </div>
        </div>
    )
}