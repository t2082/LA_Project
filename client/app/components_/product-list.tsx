"use client"

import { useState } from "react";
import ProductItem from "./product-item";
import { PageLoading } from "../loading/pageloading";
import { BoxesIcon } from "lucide-react";
export default function ProductList({productList}: any){
    // const [loading, setLoading] = useState(false); 

    return (
        <>
            <div className="mt-12">
                <h1 className="text-blue-800 font-bold text-3xl mb-4 mt-10">Our Popular Products</h1>
                {(productList.length === 0) ? 
                <>
                    <div className="flex justify-center items-center pt-20">
                        <BoxesIcon className="text-gray-500 w-[100px] h-[100px]" />
                        <div className="text-4xl text-center text-red-500 ">Không có sản phẩm cần tìm !</div>
                    </div>
                </>
                :
                <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {productList.map((product: any, index: any)=> index<8 &&(
                        <div key={index}>
                            <ProductItem product={product}/>
                        </div>
                    ))}
                </div>
                </>
                }
            </div>
            {/* <PageLoading status={loading} /> */}
        </>
    );
}