import { TrashIcon } from "lucide-react";
import Image from "next/image";
import formatCurrency from "../utils_/formatCurrency";

export default function CartItemList({ cartItemList, onDeleteCartItems }:any){
    
    return (
        <>
            <div className="h-[750px] overflow-auto">
                {cartItemList && cartItemList.length > 0 && cartItemList.map((item:any, index:number)=>(
                    <div key={index} className="flex items-center justify-between p-2 mt-2 mb-2 border-b">
                        <div className="flex gap-6 items-center">
                            <Image src={item.image}
                                unoptimized={true}
                                width={90}
                                height={90}
                                alt={item.name}
                                className="border p-2"
                                />
                            <div>
                                <h2 className="font-bold">{item.name}</h2>
                                <h2>{item.quantity}</h2>
                                <h2 className="font-bold">{formatCurrency.formatCurrencyVN(item.total)}</h2>
                            </div>
                        </div>
                        <TrashIcon onClick={() => onDeleteCartItems(item.id)} className="cursor-pointer"/>
                    </div>
                    
                ))}
            </div>
            
        </>
    );
}