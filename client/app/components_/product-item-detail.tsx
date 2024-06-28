"use client"
import { Button } from "@/components/ui/button";
import { LoaderCircle, Minus, Plus, ShoppingBasket } from "lucide-react";
import Image from "next/image";
import { useContext, useState } from "react";
import globalapi from "../utils_/globalapi";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { UpdateCartContext } from "../context/UpdateCartContext";
import formatCurrency from "../utils_/formatCurrency";
import { useUpdateCart } from "../hook/useUpdateCart";


export default function ProductItemDetail({product}:any) {

    const price_sale = formatCurrency.formatCurrencyVN(product.attributes.price_sale);
    const price = formatCurrency.formatCurrencyVN(product.attributes.price);

    const [productTotalPrice, setProductTotalPrice]=useState( 
        product.attributes.price_sale ? product.attributes.price_sale : product.attributes.price
    );
    
    const [productQuantity, setProductQuantity] = useState(1);
    const [loadings, setLoadings] = useState(false);

    const jwt = sessionStorage.getItem('jwt');
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const route = useRouter();

    const { updateCart, setUpdateCart } = useUpdateCart();

    const onAddToCart = ()  => {
        setLoadings(true);
        if(!jwt){
            route.push('/sign-in');
            setLoadings(false);
            return;
        }else{
            const data = {
                data:{
                    quantity: productQuantity,
                    total: (productQuantity * productTotalPrice),
                    products: product.id,
                    users_permissions_user: user.id,
                    userID: user.id
                }
            }
            globalapi.addToCart(data, jwt).then(response=> {
                console.log(response);
                toast({
                    variant: "default",
                    description: "Added to cart !",
                })
                setUpdateCart(!updateCart)
                setLoadings(false);
            }, (e)=>{
                toast({
                    variant: "failed",
                    description: e.message,
                })
                setLoadings(false);
            });
        }
    }
    return (
        <>
            <div className="grid grid-cols-2 p-7 bg-white text-black">
                <div>
                    <Image src={
                        product?.attributes?.images?.data?.[0]?.attributes?.url}
                        unoptimized={true}
                        alt={product.attributes.name}
                        width={300}
                        height={300}
                        className="bg-white h-[320px] w-[300px] object-contain rounded-lg"
                    />
                </div>
                <div>
                    <h2 className="text-xl">{product.attributes.name}</h2>
                    <div className="flex">
                        <h2 className="text-sm text-gray-500">Category: <span>{product.attributes.categories.data?.[0]?.attributes?.name}</span></h2>
                        <h2 className="text-sm text-gray-500">, Quantity: {product.attributes.quantity}</h2>
                    </div>
                    <div className="h-[185px] mt-3 overflow-hidden relative">
                        <h3 className="font-bold">Description:</h3>
                        <h4 className="max-h-[150px] overflow-y-auto pr-2">
                            {product.attributes.description}
                        </h4>
                    </div>
                    <div className="flex gap-3">
                        <h2 className="text-lg">Price: </h2>
                        {
                        productQuantity === 1 ? 
                        <>
                            <h2 className={`font-bold text-lg ${product.attributes.price_sale && 'line-through text-gray-500'}`}>{price}</h2>
                            {product.attributes.price_sale && <h2 className="font-bold text-lg">{price_sale}</h2>}
                        </>
                        :
                        <>
                            {
                            product.attributes.price_sale != null ?
                            <>
                                <h2 className={`font-bold text-lg ${product.attributes.price_sale && 'line-through text-gray-500'}`}>{price}</h2>
                                <h2 className="font-bold text-lg">{formatCurrency.formatCurrencyVN(productQuantity * productTotalPrice)}</h2>
                            </>
                            :
                            <>
                                <h2 className="font-bold text-lg"> ${formatCurrency.formatCurrencyVN(productQuantity * productTotalPrice)}</h2>
                            </>
                            }
                        </>
                        }
                    </div>
                    <div className="mt-3">
                        <div className="lg:flex md:flex gap-4">
                            <div className="p-2 flex border items-center px-3">
                                <button onClick={() =>productQuantity>1?setProductQuantity(productQuantity-1):1}><Minus size={16} strokeWidth={1.25} /></button>
                                <h2 className="w-[40px] text-center">{productQuantity}</h2>
                                <button onClick={()=>setProductQuantity(productQuantity+1)}><Plus size={16} strokeWidth={1.25} /></button>
                            </div>
                            <Button variant="outline" className="text-white bg-blue-800 hover:bg-blue-900 hover:text-white flex gap-3" onClick={()=>onAddToCart()} disabled={loadings}>
                                <ShoppingBasket/>
                                {loadings ? <LoaderCircle className="animate-spin" />:"Add to cart"}
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
};
