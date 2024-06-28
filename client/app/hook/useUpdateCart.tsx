import { useContext } from "react";
import { UpdateCartContext } from "../context/UpdateCartContext";

export const useUpdateCart = () => {
    const context = useContext(UpdateCartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};