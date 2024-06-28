"use client"
import { useLoading } from "@/app/hook/useLoading";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function TopCategoryList({ categoryList, selectedCategory }: any){
    const { setLoading } = useLoading();
    
    const pathname = usePathname();
    
    useEffect(() => {
        const expectedPageName = selectedCategory;
        const currentPath = decodeURIComponent(pathname).split('/').pop();
        if (expectedPageName == currentPath) {
            setLoading(false);
        }
    }, [pathname]);

    const onNavigate = (selectedCategory: string, categoryName: string) => {
        if (selectedCategory !== categoryName) setLoading(true);
    }
    
    return (
        <>
            <div className="flex sm:grid-cols-4 md:grid-cols-6 gap-5 mt-3 overflow-auto mx-7 md:mx-20 justify-center">
                {categoryList.map((categories: any, index: any) => (
                    <Link href={'/products-category/' + categories.attributes.name} 
                        className={`flex flex-col items-center bg-blue-100 gap-3 p-3 rounded-lg group cursor-pointer text-center w-[150px] min-w-[100px] 
                        ${selectedCategory == categories.attributes.name ? 'text-white bg-blue-600 hover:bg-blue-700' : 'hover:bg-blue-200'}`}
                        onClick={() => onNavigate(selectedCategory, categories.attributes.name)}>
                        <Image key={index} src={
                            categories?.attributes?.icon?.data?.[0]?.attributes?.url}
                            unoptimized={true}
                            alt="categories"
                            width={50}
                            height={50}
                            className="hover:scale-125 transition-all ease-in"
                        />
                        <h2 className={`text-blue-900 md:text-lg sm:text-sm ${selectedCategory == categories.attributes.name && 'text-white'}`}>{categories.attributes.name}</h2>
                    </Link>
                ))}
            </div>
            
        </>
    )
}