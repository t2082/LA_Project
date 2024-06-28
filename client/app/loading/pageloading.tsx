import Image from "next/image";

function PageLoading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
            <div className="flex flex-col justify-center items-center gap-4">
                <div className="relative flex items-center justify-center h-28 w-28">
                    <Image src="/assets/images/logo_3.png" alt="logo" width={70} height={70} />
                    <div className="absolute loader ease-linear rounded-full border-4 border-t-4 border-white h-full w-full"></div>
                </div>
                <div className="ml-5">
                    <h2 className="text-2xl text-white">Please wait...</h2>
                </div>
            </div>

            <style jsx>{`
                .loader {
                border-top-color: #3498db;
                animation: spin 1s linear infinite;
                }
                @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );

};

function ComponentLoading(){
    return (
        <>
            <h1 className="text-red-500 text-9xl">
                ĐANG LOADING
            </h1>
        </>    
    )
}


export { PageLoading, ComponentLoading };