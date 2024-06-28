"use client"
import { Input } from "@/components/ui/input";
import PauseLoad from "./components_/stop-loading";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoaderCircle, PenLineIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import globalapi from "@/app/utils_/globalapi";
export default function (){
    const jwt = sessionStorage.getItem("jwt");
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber)
    const [address, setAddress] = useState(user.address)
    const [password, setPassword] = useState(user.password)
    const [loading_, setLoading_] = useState(false);

    const onChange = ()=>{
        if (!jwt) {
            toast({
                variant: "failed",
                description: "Error JWT Authentication !",
            })
            setLoading_(false)

        } else {
            const data_profile = {
                data: {
                    email: email,
                    phoneNumber: phoneNumber,
                    address: address,
                    password: password
                }
            }
            globalapi.updateProfile(user.id, jwt, data_profile).then(response => {
                console.log(response);
                toast({
                    variant: "success",
                    description: "Change Successfully !",
                })
            })
        }
    }

    return (
        <>
            <h2 className="p-3 bg-blue-800 text-2xl font-bold text-center text-white">
                My Profile
            </h2>
            
            <div className="my-20 mx-64 flex flex-col gap-5">
                <div>
                    <h2>Username: </h2>
                    <Input value={username} disabled/>
                </div>
                <div>
                    <h2>Email: </h2>
                    <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <h2>Phone number: </h2>
                    <Input placeholder="Phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                </div>
                <div>
                    <h2>Address: </h2>
                    <Input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div>
                    <h2>Password: </h2>
                    <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button className="bg-blue-800 text-black hover:bg-blue-900 gap-3" onClick={() => onChange()}>
                    <h2 className="text-lg text-white font-bold">{loading_ ? <LoaderCircle className="animate-spin" /> : <div className="flex">Change infomation &nbsp;<PenLineIcon className="text-blue-800" /></div>}</h2>
                </Button>
            </div>
            <PauseLoad _string="my-profile"/>
        </>
    );
}