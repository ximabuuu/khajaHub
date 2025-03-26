import { createContext, useContext, useEffect, useState } from "react";
import Axios from "../utils/axios.js";
import SummaryApi from "../config/summaryApi.js";
import { useDispatch, useSelector } from "react-redux";
import { handleAddCart } from "../redux/cartStore.js";
import AxiosToastError from "../utils/AxiosToastError.js";
import toast from "react-hot-toast";
import { DiscountedPrice } from "../utils/DiscountedPrice.js";
import { handleAddAddress } from "../redux/addressSlice.js";

export const GlobalContext = createContext(null);

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalFunc = ({ children }) => {
    const dispatch = useDispatch();
    const [totalPrice, setTotalPrice] = useState(0);
    const [originalPriceTotal, setOriginalPriceTotal] = useState(0);
    const [totalQty, setTotalQty] = useState(0);
    const cartItem = useSelector(state => state.cartItem.cart);
    const user = useSelector(state => state?.user);

    // Fetch cart items from the database
    const fetchCartItem = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.getCartItem
            });

            const { data: responseData } = response;

            if (responseData.success) {
                dispatch(handleAddCart(responseData.data)); // ✅ Replace cart with new data
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Update cart quantity
    const updateCartItem = async (id, qty) => {
        try {
            const response = await Axios({
                ...SummaryApi.updateCartQty,
                data: { _id: id, qty: qty }
            });

            const { data: responseData } = response;

            if (responseData.success) {
                toast.success(responseData.message);
                fetchCartItem(); // ✅ Refresh cart after update
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    // Delete item from cart
    const deleteCartItem = async (cartId) => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteCartItem,
                data: { _id: cartId }
            });

            const { data: responseData } = response;

            if (responseData.success) {
                toast.success(responseData.message);
                fetchCartItem(); // ✅ Refresh cart after deletion
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };



    useEffect(() => {
        const qty = cartItem.reduce((prev, curr) => prev + curr.quantity, 0);
        setTotalQty(qty);

        const tPrice = cartItem.reduce((prev, curr) => {
            const priceAfterDis = DiscountedPrice(curr?.productId?.price, curr?.productId?.discount);
            return prev + (priceAfterDis * curr.quantity);
        }, 0);
        setTotalPrice(tPrice);

        const originalPrice = cartItem.reduce((prev, curr) => prev + (curr?.productId?.price * curr?.quantity), 0);
        setOriginalPriceTotal(originalPrice);
    }, [cartItem]);

    // Clear entire cart (after successful payment)
    const clearCart = () => {
        dispatch(handleAddCart([]));
    };


    const fetchAddress = async (params) => {
        try {
            const response = await Axios({
                ...SummaryApi.getAddress
            })

            const { data: responseData } = response

            if (responseData.success) {
                dispatch(handleAddAddress(responseData.data))
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    const clearCartSuccess = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.clearCart
            });

            if (response.data.success) {
                toast.success(response.data.message);
                dispatch(handleAddCart([]));
            } else {
                toast.error("Failed to clear cart");
            }
        } catch (error) {
            console.error("Failed to clear cart:", error);
            toast.error(error.response?.data?.message || "Failed to clear cart");
        }
    };



    useEffect(() => {
        if (user) {
            fetchCartItem();
            fetchAddress()
        } else {
            clearCart()
        }

    }, [user]);




    return (
        <GlobalContext.Provider value={{
            fetchCartItem,
            updateCartItem,
            deleteCartItem,
            clearCart,
            fetchAddress,
            clearCartSuccess,
            totalQty,
            totalPrice,
            originalPriceTotal
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalFunc;
