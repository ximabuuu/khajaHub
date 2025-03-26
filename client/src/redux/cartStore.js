import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: []
}

const cartSlice = createSlice({
    name: "cartItem",
    initialState: initialState,
    reducers: {
        handleAddCart: (state, action) => {
            state.cart = [...action.payload]
        }
    }
})


export const { handleAddCart } = cartSlice.actions

export default cartSlice.reducer