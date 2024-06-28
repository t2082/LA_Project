"use client"
import Image from "next/image";
import Link from "next/link";
import { useLoading } from "../hook/useLoading";

export default function CategoryList({categoryList}:any){
    const { setLoading } = useLoading();
    return (
        <>
            <h1 className="text-blue-800 font-bold text-3xl mt-10">Store by Category</h1>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-5 mt-3 ">
                {categoryList.map((categories: any, index: any) => (
                    <Link href={'/products-category/' + categories.attributes.name} 
                        className="flex flex-col items-center bg-blue-100 gap-3 p-3 rounded-lg group cursor-pointer text-center hover:bg-blue-200"
                        onClick={() => setLoading(true)}
                        >
                        <Image key={index} src={
                            categories?.attributes?.icon?.data?.[0]?.attributes?.url}
                            unoptimized={true}
                            alt="categories"
                            width={50}
                            height={50}
                            className="hover:scale-125 transition-all ease-in"
                        />
                        <h2 className="text-blue-900 md:text-lg sm:text-sm">{categories.attributes.name}</h2>
                    </Link>
                ))}
            </div>
        </>
    );
}