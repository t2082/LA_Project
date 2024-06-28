import globalapi from "@/app/utils_/globalapi";
import TopCategoryList from "../components_/top-category-list";
import ProductList from "@/app/components_/product-list";

export default async ({params}:any) => {
    const productList = await globalapi.getProductsByCategory(params.categoryName)
    const categoryList = await globalapi.getCategoryList();
    const categoryName = decodeURIComponent(params.categoryName);
    
    return (
        <>  
            <h2 className="p-4 bg-blue-600 text-white text-3xl text-center">
                {categoryName}
            </h2>
            <TopCategoryList categoryList={categoryList} selectedCategory={categoryName}/>
            <div className="p-5 md:p-10">
                <ProductList productList={productList} />
            </div>
        </>
    )
};