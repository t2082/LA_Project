"use client"

import { Button } from "@/components/ui/button";
import { CircleUserIcon, LayoutGrid, Search, ShoppingBag } from "lucide-react";
import Image from "next/image";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
} from "@/components/ui/dropdown-menu"

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import {
    CreditCard,
    LogOut,
    User,
} from "lucide-react"

import globalapi from "../utils_/globalapi";
import {useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname} from "next/navigation";
import CartItemList from "./cart-item-list";
import { toast } from "@/components/ui/use-toast";
import formatCurrency from "../utils_/formatCurrency";
import { useUpdateCart } from "../hook/useUpdateCart";
import { useLoading } from "../hook/useLoading";

export default function Header() {
    // const jwt = sessionStorage.getItem("jwt");
    // const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    const { setLoading } = useLoading();
    const [jwt, setJwt] = useState<string | null>(null);
    const [user, setUser] = useState<any>({});
    const [totalCartItems, setTotalCartItems] = useState(0);
    const { updateCart, setUpdateCart } = useUpdateCart();
    // categoryList ban đầu khởi tạo là chuỗi rỗng [], setCategoryList dùng để cập nhật trạng thái của categoryList khi gọi
    const [categoryList, setCategoryList] = useState([]);
    const isLogin = jwt ? true: false;
    const route = useRouter();
    const [cartItemList, setCartItemList] = useState<any[]>([]);
    const [subTotal, setSubTotal] = useState(0)
    const [searchString, setSearchString] = useState('');

    // Khi component này được render lần đầu tiên, Hook useEffect sẽ chạy hàm getCategoryList để gọi API và trả về, khi có kế quả sẽ ghi ra console.log

    useEffect(() => {
        setLoading(true);
        if (typeof window !== 'undefined') {
            const storedJwt = sessionStorage.getItem("jwt");
            const storedUser = JSON.parse(sessionStorage.getItem('user') || '{}');
            setJwt(storedJwt);
            setUser(storedUser);
        }
    }, []);

    useEffect(()=> {
        getCategoryList();
        getCartItems() ;
        setUpdateCart(true);
    }, [updateCart])
    
    useEffect(() => {
        let total = 0;
        if (cartItemList) {
            cartItemList.forEach((item: any) => {
                total += Number(item.total);
            })
        }
        setSubTotal(total);
    }, [cartItemList])
        
    // Đợi categoryList và load xong, nếu > 0 thì tắt loading
    const pathname = usePathname();
    useEffect(() => {
        const expectedPageName = '/';
        if (categoryList.length > 0 && pathname === expectedPageName) {
            setLoading(false);
        }
    }, [categoryList, pathname]);

    const getCategoryList = () =>{
        globalapi.getCategory().then(response=>{
            setCategoryList(response.data.data)
        })
    }

    const getCartItems=async()=>{
        if (!jwt) {
            setTotalCartItems(0)
        } else {
            const cartItemList_ = await globalapi.getCartItemsByUserID(user.id, jwt);
            setTotalCartItems(cartItemList_?.length);
            setCartItemList(cartItemList_)
        }
    }

    const onDeleteCartItems =(id:number)=>{
        if(jwt){
            globalapi.deleteCartItemsByUserID(id, jwt).then(response => {
                toast({
                    variant: "default",
                    description: "Item removed !",
                })
                getCartItems();
            })
        }
    }

    const onProfile = () => {
        if (pathname !== '/my-profile') {
            setLoading(true)
            route.push('/my-profile')
        }
    }

    const onMyOrder = () => {
        if (pathname !== '/my-order'){
            setLoading(true)
            route.push('/my-order')
        }
    }

    const onSignOut = () =>{
        sessionStorage.clear()
        route.push('/sign-in')
    }


    // const pathname = usePathname();
    const onHome = () => {
        if (pathname !== '/'){
            setLoading(true)
            route.push('/')
        }
    }

    const onCheckOut = () => {
        setLoading(true)
        if (jwt && subTotal > 0) {
            route.push('/checkout')
        }
        else if (subTotal == 0) {
            if (pathname == '/') setLoading(false);
            else route.push('/');
        } else {
            route.push('/sign-in')
        }
    }

    const onSelectCategory = (categoryName: string) => {
        const currentPath = decodeURIComponent(pathname).split('/').pop();
        if (currentPath !== categoryName) {
            setLoading(true)
            route.push('/products-category/' + categoryName)
        }
    }

    const onSearched = (key: string, searchString: string) => {
        if(key === 'Enter'){
            setLoading(true)
            route.push('/products-result/' + searchString)
        }
    }

    return (
        <div className="p-5 shadow-md flex justify-between">
            <div className="flex items-center gap-8">
                <Image src='/assets/images/logo.png' alt="logo" width={200} height={100} onClick={() => onHome()} className="cursor-pointer"/>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <h2 className="hidden md:flex gap-2 items-center border rounded-full p-2 px-10 bg-slate-100 cursor-pointer"><LayoutGrid className="w-5 h-5" />Category</h2>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="z-10">
                        <DropdownMenuLabel className="text-lg">Browse Category</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {categoryList.map((category: any, index) => (
                            <DropdownMenuSub key={index}>
                                <DropdownMenuItem>
                                    <div className="flex gap-4 items-center w-full cursor-pointer" onClick={() => onSelectCategory(category.attributes.name)}>
                                        <Image src={
                                            category?.attributes?.icon?.data?.[0].attributes?.url
                                            }
                                            unoptimized={true}
                                            width={25}
                                            height={25}
                                            alt="ico"
                                            />
                                        <h3 className="text-base">{category.attributes.name}</h3>
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuSub>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="md:flex gap-3 items-center border rounded-full p-2 px-5 hidden">
                    <Search/>
                    <input type="text" placeholder="Search for medicine" className="outline-none" onChange={(e)=>setSearchString(e.target.value)} value={searchString} onKeyDown={(e) => onSearched(e.key, searchString)}/>
                </div>
            </div>

            <div className="flex gap-7 items-center">
                {!isLogin?
                    <>
                        <Link href='/sign-in'>
                            <Button className="bg-blue-700 text-white hover:bg-blue-800 text-base" onClick={()=>setLoading(true)}> Login</Button>
                        </Link>
                    </>
                    :
                    <>
                        <DropdownMenu>
                            <div className="flex justify-center items-center gap-2">
                                <h2 className="font-bold text-blue-900 text-base md:text-xl lg:text-xl">{user.username}</h2>
                                <DropdownMenuTrigger>
                                        <CircleUserIcon className="bg-blue-300 text-blue-800 p-2 rounded-full w-12 h-12" />
                                </DropdownMenuTrigger>
                            </div>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => onProfile()} >
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={()=>onMyOrder()}>
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    <span>My Order</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer" onClick={()=>onSignOut()}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        
                        <Sheet>
                            <SheetTrigger>
                                <h2 className="flex gap-1 items-center text-lg"><ShoppingBag className="w-7 h-7" /><span className="text-white bg-blue-500  px-2 rounded-full">{totalCartItems}</span></h2>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle className="bg-blue-800 text-white text-lg p-2 text-center">My Cart</SheetTitle>
                                    <SheetDescription>
                                        <CartItemList cartItemList={cartItemList} onDeleteCartItems={onDeleteCartItems} />
                                    </SheetDescription> 
                                </SheetHeader>
                                <SheetClose asChild>
                                    <div className="absolute w-[90%] bottom-6 flex flex-col">
                                        <h2 className="text-lg font-bold flex justify-between">
                                            Subtotal: <span>{formatCurrency.formatCurrencyVN(subTotal)}</span>
                                        </h2>
                                        <Button className="text-white bg-blue-800 hover:bg-blue-900" onClick={() => onCheckOut()}>Checkout</Button>
                                    </div>
                                </SheetClose>
                            </SheetContent>
                        </Sheet>
                    </>
                }
            </div>
        </div>
    );
}
