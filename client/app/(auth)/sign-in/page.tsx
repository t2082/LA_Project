"use client"
import globalapi from "@/app/utils_/globalapi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { usePathname, useRouter } from "next/navigation";
import { useLoading } from "@/app/hook/useLoading";
export default function () {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const route = useRouter();
    const { setLoading } = useLoading();

    useEffect(() => {
        const jwt = sessionStorage.getItem("jwt");
        if (jwt) {
            route.push('/')
        } else {
            route.push('/sign-in')
        }
    }, [])

    const pathname = usePathname();

    useEffect(() => {
        const expectedPageName = 'sign-in';
        const currentPath = decodeURIComponent(pathname).split('/').pop();
        if (expectedPageName == currentPath) {
            setLoading(false);
        }
    }, [pathname]);

    const onLogin = () => {
        setLoading(true);
        globalapi.loginUser(username, password).then(response=>{
            sessionStorage.setItem('user', JSON.stringify(response.data.user))
            sessionStorage.setItem('jwt', response.data.jwt)
            toast({
                variant: "success",
                description: "Login Successfully !",
            })
            route.push('/')
        }, (e)=>{
            toast({
                variant: "failed",
                description: e?.response?.data?.error?.message,
            })
            setLoading(false)
        })
    }

    return (
        <>
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center justify-center p-10 bg-blue-100">
                    <Link href="/">
                        <Image src='/assets/images/logo_2.png' alt="logo" width={150} height={150} />
                    </Link>
                    <h2 className="font-bold text-3xl">Sign In to Account</h2>
                    <h2 className="text-gray-500">Enter your account to sign in</h2>
                    <div className="w-full flex flex-col gap-5 m-10">
                        <Input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                        <Input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                        <Button className="bg-blue-800 hover:bg-blue-900 disabled:bg-blue-600" onClick={() => onLogin()} disabled={!username || !password}>Sign In</Button>
                        <p className="text-sm">
                            Don't have an account? 
                            <Link href="/register" className="text-blue-800 hover:text-blue-900" onClick={() => setLoading(true)}>
                                &nbsp;Click here to create an account!
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}