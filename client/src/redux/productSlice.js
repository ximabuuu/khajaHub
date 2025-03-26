import {createSlice} from "@reduxjs/toolkit";

const initialValue = {
    allCategory : [],
    loadingCategory : false,
    allSubCategory : [],
    restaurant : [],
    product : []
}

const productSlice = createSlice({
    name : 'product',
    initialState : initialValue,
    reducers : {
        setAllCategory : (state,action)=>{
            state.allCategory = [...action.payload]
        },
        setLoadingCategory : (state,action)=>{
            state.loadingCategory = action.payload
        },
        setAllSubCategory : (state,action)=>{
            state.allSubCategory = [...action.payload]
        },
        setRestaurant : (state,action)=>{
            state.restaurant = [...action.payload]
        }
    }
})

export const {setAllCategory,setAllSubCategory,setRestaurant,setLoadingCategory} = productSlice.actions

export default productSlice.reducer