import Image from "next/image";
import Slider from "./components_/slider";
import globalapi from "./utils_/globalapi";
import CategoryList from "./components_/categories";
import ProductList from "./components_/product-list";
import Footer from "./components_/footer";

export default async function Home() {

  const sliderList = await globalapi.getSlider();
  const categoryList = await globalapi.getCategoryList();
  const productList = await globalapi.getAllProducts();

  return (
    <>
      <div className="pt-10 px-16">
        <Slider sliderList={sliderList}/>
        <CategoryList categoryList={categoryList} />
        <ProductList productList={productList}/>
        <Image src="/assets/images/bot-banner.png" width={2048} height={200} alt="banner" className="w-full h-full object-contain"/>
        <Footer/> 
      </div>
    </>
  );
}
