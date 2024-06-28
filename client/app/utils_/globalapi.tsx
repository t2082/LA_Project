import axios from "axios";

const axiosClient=axios.create({
    baseURL: 'https://striking-blessing-5886da1c41.strapiapp.com/api/'
});

const getCategory = () => axiosClient.get('/categories?populate=*');

const getCategoryList = () => axiosClient.get('/categories?populate=*').then((response) =>{
    return response.data.data;
});

// const getSubCategoryById = (id:Number) => axiosClient.get('sub-categories?populate=*&filters[category][id][$eq]='+id)

const getSlider = () => axiosClient.get('/sliders?populate=*').then(response=>{
    return response.data.data;
});

const getAllProducts = () => axiosClient.get('/products?populate=*').then(response=>{
    return response.data.data;
});

const getProductsByCategory = (nameCategory: String) => axiosClient.get('products?filters[categories][name][$in]='+nameCategory+'&populate=*').then(response => {
    return response.data.data;
});

const registerUser = (username: string, email: string, phoneNumber: string, address: string, password: string)=>axiosClient.post('/auth/local/register', {
    username: username, 
    email: email, 
    phoneNumber: phoneNumber, 
    address: address, 
    password: password,
})

const loginUser = (username: string, password: string)=>axiosClient.post('/auth/local', {
    identifier: username, 
    password: password,
})

const addToCart = (data:any, jwt:string)=>axiosClient.post('/user-carts',data,{
    headers : {
        Authorization: `Bearer ${jwt}`
    }
})

const getCartItemsByUserID = (userID: number, jwt: string) => axiosClient.get('/user-carts?filters[userID][$eq]=' + userID +'&[populate][products][populate][images][populate][0]=url', {
    headers: {
        Authorization: `Bearer ${jwt}`
    }
}).then(response =>{
    const data = response.data.data;
    const cartItemsList = data.map((item:any, index:any)=>({
        name: item?.attributes?.products?.data?.[0]?.attributes.name,
        quantity: item.attributes.quantity,
        total: item.attributes.total,
        image: item?.attributes?.products?.data?.[0]?.attributes?.images?.data[0].attributes.url,
        actualPrice: item?.attributes?.products?.data?.[0]?.attributes?.price,
        id: item.id,
        product: item?.attributes?.products?.data?.[0]?.id
    }))
    console.log(cartItemsList);
    return cartItemsList;
});

const deleteCartItemsByUserID = (id: number, jwt: string) => axiosClient.delete('/user-carts/'+ id, {
    headers: {
        Authorization: `Bearer ${jwt}`
    }
})

const createOrder = (data: any, jwt: string) => axiosClient.post('/orders', data, {
    headers: {
        Authorization: `Bearer ${jwt}`
    }
})


const getOrderByID = (userID: number, jwt: string) => axiosClient.get('/orders?filters[userID][$eq]=' + userID +'&populate[orderItemList][populate][product][populate][images]=url', {
    headers: {
        Authorization: `Bearer ${jwt}`
    }
}).then(response => {
    const data = response.data.data;
    const orderList = data.map((item: any, index: any) => ({
        id: item.id,
        totalOrderAmount: item.attributes?.totalOrderAmount,
        paymentID: item.attributes?.paymentID,
        orderItemList: item.attributes?.orderItemList,
        createdAt: item.attributes?.createdAt,
        status: item.attributes?.status
    }))
    console.log(orderList);
    return orderList;
});

const findProductByName = (searchString: string) => axiosClient.get('products?filters[name][$contains]=' + searchString +'&populate=*').then(response => {
    return response.data.data;
});


const updateProfile = (id: number, jwt: string, data: any) => {
    return axiosClient.put(`/users/${id}`, data,
        {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        }
    );
};


export default { getCategory, getSlider, getCategoryList, getAllProducts, getProductsByCategory, registerUser, loginUser, addToCart, getCartItemsByUserID, deleteCartItemsByUserID, createOrder, getOrderByID, findProductByName, updateProfile }
