import { Button } from "@/components/ui/button";
import Image from "next/image";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog"
import ProductItemDetail from "./product-item-detail";
import formatCurrency from "../utils_/formatCurrency";


export default function ProductItem({product}: any) {
    return (
        <>
            <div className="p-2 h-[300px] md:p-6 md:h-full lg:p-7 lg:h-full flex flex-col items-center justify-center gap-3 border rounded-lg cursor-pointer hover:scale-105 hover:shadow-lg transition-all ease-in-out">
                <Image src={
                    product?.attributes?.images?.data?.[0]?.attributes?.url}
                    unoptimized={true}
                    alt={product.attributes.name}
                    width={500}
                    height={200}
                    className="h-[250px] w-[200px] object-contain"
                />
                <h2 className="text-center font-bold text-lg">{product.attributes.name}</h2>
                <div className="flex gap-3">
                    <h2 className={`font-bold text-lg ${product.attributes.price_sale && 'line-through text-gray-500'}`}>{formatCurrency.formatCurrencyVN(product.attributes.price)} {!product.attributes.price_sale && ' / '+ product.attributes.unit}</h2>
                    {product.attributes.price_sale && <h2 className="font-bold text-lg">{formatCurrency.formatCurrencyVN(product.attributes.price_sale)} / {product.attributes.unit}</h2>}
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="text-blue-800 hover:text-white hover:bg-blue-800 ">Product Detail</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogDescription>
                                <ProductItemDetail product={product} />
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}