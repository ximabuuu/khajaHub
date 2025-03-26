import {createBrowserRouter} from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import SearchPage from '../pages/SearchPage'
import Login from '../pages/Login.jsx'
import Register from '../pages/Register'
import ForgotPassword from '../pages/ForgotPassword'
import Otp from '../pages/Otp'
import ResetPassword from '../pages/ResetPassword'
import UserMobile from '../pages/UserMobile'
import Dashboard from '../layouts/Dashboard'
import Profile from '../pages/Profile'
import Orders from '../pages/Orders'
import Address from '../pages/Address'
import Category from '../pages/Category'
import SubCategory from '../pages/SubCategory'
import AddProduct from '../pages/AddProduct'
import Products from '../pages/Products'
import Restaurant from '../pages/Restaurant'
import AdminPerm from '../layouts/AdminPerm'
import ProductListPage from '../pages/ProductListPage'
import ProductDisplay from '../pages/ProductDisplay'
import OrdersAdmin from '../pages/OrdersAdmin'
import CartMobile from '../pages/CartMobile'
import CheckOutPage from '../pages/CheckOutPage'
import Payment from '../component/Payment/Payment'
import Success from '../component/Payment/Success'
import Failure from '../component/Payment/Failure'

const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            {
                path : "",
                element : <Home/>
            },
            {
                path : "search",
                element : <SearchPage/>
            },
            {
                path : "login",
                element : <Login/>
            },
            {
                path : "register",
                element : <Register/>
            },
            {
                path : "forgot-password",
                element : <ForgotPassword/>
            },
            {
                path : "otp",
                element : <Otp/>
            },
            {
                path : "reset-password",
                element : <ResetPassword/>
            },
            {
                path : "user",
                element : <UserMobile/>
            },
            {
                path : "dashboard",
                element : <Dashboard/>,
                children : [
                    {
                        path : "profile",
                        element : <Profile/>
                    },
                    {
                        path : "myorders",
                        element : <Orders/>
                    },
                    {
                        path : "address",
                        element : <Address/>
                    },
                    {
                        path : "category",
                        element : <AdminPerm><Category/></AdminPerm>
                    },
                    {
                        path : "subcategory",
                        element : <AdminPerm><SubCategory/></AdminPerm>
                    },
                    {
                        path : "add-product",
                        element : <AdminPerm><AddProduct/></AdminPerm>
                    },
                    {
                        path : "products",
                        element : <AdminPerm><Products/></AdminPerm>
                    },
                    {
                        path : "restaurant",
                        element : <AdminPerm><Restaurant/></AdminPerm>
                    },
                    {
                        path : "allorders",
                        element : <AdminPerm><OrdersAdmin/></AdminPerm>
                    }
                ]
            },
            {
                path : ":category",
                children : [
                    {
                        path : ":subCategory",
                        element : <ProductListPage/>
                    }
                ]

            },
            {
                path : "product/:product",
                element : <ProductDisplay/>
            },
            {
                path : "cart",
                element : <CartMobile/>
            },
            {
                path : "checkout",
                element : <CheckOutPage/>
            },
            {
                path : "payment",
                element : <Payment/>
            },
            {
                path : "success",
                element : <Success/>
            },
            {
                path : "failure",
                element : <Failure/>
            }
        ]
    }
])

export default router