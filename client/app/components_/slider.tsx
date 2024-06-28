import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

export default function Slider({sliderList}:any){
    return (
        <>
            <Carousel>
                <CarouselContent>
                     
                    {sliderList.map((slider: any, index: any)=>(
                        <CarouselItem key={index}>
                            <Image src={slider?.attributes?.image?.data?.[0]?.attributes?.url}
                                unoptimized={true}
                                alt="top-banner"
                                width={900}
                                height={400}
                                className="w-full h-[400] md:h-[600px] object-cover rounded-2xl"
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </>
    );
}