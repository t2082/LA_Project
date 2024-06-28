import globalapi from "@/app/utils_/globalapi";
import ProductList from "@/app/components_/product-list";
import PauseLoad from "../components_/stop-loading";

export default async ({ params }: any) => {
    const productList = await globalapi.findProductByName(params.searchString)
    const searchString = decodeURIComponent(params.searchString);

    return (
        <>
            <h2 className="p-4 bg-blue-600 text-white text-3xl">
                Search result for "{searchString}":
            </h2>
            <div className="p-5 md:p-10">
                <ProductList productList={productList} />
            </div>
            <PauseLoad stringSearch={searchString}/>
        </>
    )
};