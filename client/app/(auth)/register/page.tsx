"use client"
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import globalapi from "@/app/utils_/globalapi";
import { useToast } from "@/components/ui/use-toast";
import { usePathname, useRouter } from "next/navigation";
import { PageLoading } from "@/app/loading/pageloading";
import { useLoading } from "@/app/hook/useLoading";

export default function(){
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [address, setAddress] = useState("")
    const [password, setPassword] = useState("")
    const [rePassword, setRePassword] = useState("")
    const route = useRouter();
    const { toast } = useToast()
    const { setLoading } = useLoading();
    
    useEffect(() => {
        const jwt = sessionStorage.getItem("jwt");
        if (jwt) {
            route.push('/')
        } else {
            route.push('/register')
        }
    }, [])

    const pathname = usePathname();
    useEffect(() => {
        const expectedPageName = 'register';
        const currentPath = decodeURIComponent(pathname).split('/').pop();
        if (expectedPageName == currentPath) {
            setLoading(false);
        }
    }, [pathname]);


    const onRegister=()=>{
        setLoading(true);
        globalapi.registerUser(username, email, phoneNumber, address, password).then(response=>{
            console.log(response.data.user)
            console.log(response.data.jwt)
            sessionStorage.setItem('user', JSON.stringify(response.data.user))
            sessionStorage.setItem('jwt',response.data.jwt)
            toast({
                variant: "success",
                description: "Account Created Successfully !",
            })
            route.push('/')
        }, (e)=>{
            
            toast({
                variant: "failed",
                description: e?.response?.data?.error?.message,
            })
            setLoading(false);
        })
    }

    //Kiểm tra định dạng email
    function isValidEmail(email: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    //kiểm tra định dạng số điện thoại
    function isValidPhoneNumber(phone: string): boolean {
        const phoneRegex = /^(?:\+84|0)(?:3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/;
        return phoneRegex.test(phone);
    }

    return (
        <>
            {/* <PageLoading status={loading} /> */}
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center justify-center p-10 bg-blue-100">
                    <Link href="/">
                        <Image src='/assets/images/logo_2.png' alt="logo" width={150} height={150} />
                    </Link>
                    <h2 className="font-bold text-3xl">Create An Account</h2>
                    <h2 className="text-gray-500">Enter your information to register an account </h2>
                    <div className="w-full flex flex-col gap-5 m-10">
                        <Input placeholder="Username (*)" onChange={(e) => setUsername(e.target.value)} />
                        <div className="relative">
                            <Input placeholder="your_email@example.com (*)" onChange={(e) => setEmail(e.target.value)} />
                            {email != '' && !isValidEmail(email) && <span className="absolute top-1/2 right-0 transform translate-x-[105%] translate-y-[-50%] ml-3 text-red-500 bg-yellow-200">*! Email is not correct format</span>}
                        </div>
                        <div className="relative">
                            <Input placeholder="Phone number (*)" onChange={(e) => setPhoneNumber(e.target.value)} />
                            {phoneNumber != '' && !isValidPhoneNumber(phoneNumber) && <span className="absolute top-1/2 right-0 transform translate-x-[105%] translate-y-[-50%] ml-3 text-red-500 bg-yellow-200"> * ! Phone number is not correct format</span>}
                        </div>
                        <Input placeholder="Address" onChange={(e) => setAddress(e.target.value)} />
                        <Input type="password" placeholder="Password (*)" onChange={(e) => setPassword(e.target.value)} />
                        <div className="relative">
                            <Input type="password" placeholder="Re-type Password (*)" onChange={(e) => setRePassword(e.target.value)} />
                            {rePassword != '' && password !== rePassword && <span className="absolute top-1/2 right-0 transform translate-x-[105%] translate-y-[-50%] ml-3 text-red-500 bg-yellow-200">*! Password do not match</span>}
                        </div>
                        <Button className="bg-blue-800 hover:bg-blue-900 disabled:bg-blue-600" onClick={() => onRegister()} disabled={!email || !username || !phoneNumber || !password || rePassword == ''}>Register Your Account</Button>
                        <p className="text-sm">
                            Already have an account?
                            <Link href="/sign-in" className="text-blue-800 hover:text-blue-900" 
                            onClick={() => setLoading(true)}
                            >
                                Click here to Sign-in!
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}