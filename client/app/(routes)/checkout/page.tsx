"use client"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HandCoinsIcon, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import globalapi from "@/app/utils_/globalapi";
import formatCurrency from "@/app/utils_/formatCurrency";
import { toast } from "@/components/ui/use-toast";
import { usePathname, useRouter } from "next/navigation";
import { useUpdateCart } from "@/app/hook/useUpdateCart";
import { useLoading } from "@/app/hook/useLoading";
export default function Checkout() {

    const jwt = sessionStorage.getItem("jwt");
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const [totalCartItems, setTotalCartItems] = useState(0);
    const [cartItemList, setCartItemList] = useState<any[]>([]);
    const { updateCart, setUpdateCart } = useUpdateCart();
    const [loading_, setLoading_] = useState(false);
    const { setLoading } = useLoading();

    const getCartItems = async () => {
        if (!jwt) {
            setTotalCartItems(0)
        } else {
            const cartItemList_ = await globalapi.getCartItemsByUserID(user.id, jwt);
            setTotalCartItems(cartItemList_?.length);
            setCartItemList(cartItemList_)
        }
    }

    useEffect(()=>{
        getCartItems();
    },[])



    const route = useRouter();

    const [subTotal, setSubTotal] = useState(0)

    useEffect(() => {
        let total = 0;
        if (cartItemList) {
            cartItemList.forEach((item: any) => {
                total += Number(item.total);
            })
        }
        setSubTotal(total);
    }, [cartItemList])

    const pathname = usePathname();

    useEffect(() => {
        const expectedPageName = 'checkout';
        const currentPath = decodeURIComponent(pathname).split('/').pop();
        if (expectedPageName == currentPath) {
            setLoading(false);
        }
    }, [pathname]);

    const getTax = ()=>{
        return subTotal*0.09;
    }
    
    const getTotalAmount = ()=>{
        return subTotal + getTax() + 20000;
    }


    const [name, setName] = useState("");
    const [email, setEmail] = useState(user.email);
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber)
    const [zip, setZip] = useState("")
    const [address, setAddress] = useState(user.address)


    const onApprove = ()=>{
        setLoading_(true)
        if(!jwt){
            toast({
                variant: "failed",
                description: "Error JWT Authentication !",
            })
            setLoading_(false)

        }else{
            const now = new Date();
            const year = now.getFullYear().toString();
            const month = (now.getMonth() + 1).toString();
            const day = now.getDate().toString();
            const hour = now.getHours().toString();
            const minute = now.getMinutes().toString();
            const second = now.getSeconds().toString();
            const millisecond = now.getMilliseconds().toString();
            let paymentid = year + month + day + hour + minute + second + millisecond;

            const payload = {
                data: {
                    name: name,
                    email: email,
                    phone: phoneNumber,
                    zip: zip,
                    address: address,
                    totalOrderAmount: getTotalAmount(),
                    userID: user.id,
                    paymentID: paymentid,
                    orderItemList: cartItemList
                }
            }

            globalapi.createOrder(payload, jwt).then(response => {
                console.log(response);
                toast({
                    variant: "success",
                    description: "Order Places Successfully !",
                })
                cartItemList.forEach((item, index)=>{
                    globalapi.deleteCartItemsByUserID(item.id, jwt).then(response=>{
                        console.log(response);
                    });
                });
                setUpdateCart(!updateCart);
                route.push('/order-confirmation');
            }, (e) => {
                toast({
                    variant: "failed",
                    description: e.message,
                })
                setLoading_(false)
            });
        }
    }

    return (
        <>
            <h2 className="p-3 bg-blue-800 text-2xl font-bold text-center text-white">
                Checkout
            </h2>

            <div className="p-5 px-5 md:px-10 grid grid-cols-3 py-8">
                <div className="col-span-2 mx-20">
                    <h2 className="font-bold text-2xl">Billing Details:</h2>
                    <div className="grid grid-cols-2 gap-7 mt-5">
                        <Input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)}/>
                        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-7 mt-3">
                        <Input placeholder="Phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        <Input placeholder="Zip" onChange={(e) => setZip(e.target.value)} />
                    </div>
                    <div className=" mt-3">
                        <Input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>
                </div>

                <div className="mx-10 border">
                    <h2 className="p-3 bg-gray-300 font-bold text-center">
                        Total Cart ({totalCartItems})
                    </h2>
                    <div className="p-4 flex flex-col gap-4">
                        <h2 className="font-bold flex justify-between">
                            Subtotal : <span>{formatCurrency.formatCurrencyVN(subTotal)}</span>{" "}
                        </h2>
                        <hr></hr>
                        <h2 className="flex justify-between">
                            Delivery : <span>20.000đ</span>
                        </h2>
                        <h2 className="flex justify-between">
                            Tax (9%) : <span>{formatCurrency.formatCurrencyVN(getTax())}</span>
                        </h2>
                        <hr></hr>
                        <h2 className="font-bold flex justify-between">
                            Total : <span>{formatCurrency.formatCurrencyVN(getTotalAmount())}</span>
                        </h2>
                        <Button className="bg-yellow-400 text-black hover:bg-yellow-500 gap-3" disabled={!email || !name || !phoneNumber || !address || !zip || totalCartItems == 0 || loading_} onClick={() => onApprove()}>
                            <h2 className="text-lg text-blue-800 font-bold">{loading_ ? <LoaderCircle className="animate-spin" /> : <div className="flex">Click to Payment &nbsp;<HandCoinsIcon className="text-blue-800" /></div>}</h2>
                        </Button>
                    </div>  

                </div>

            </div>

        </>
    );
}
