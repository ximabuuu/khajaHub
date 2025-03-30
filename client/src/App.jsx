import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './component/Header'
import Footer from './component/Footer'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import fetchUserDetails from './utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './redux/userSlice';
import { setAllCategory, setAllSubCategory, setLoadingCategory, setRestaurant } from './redux/productSlice';
import Axios from './utils/axios';
import SummaryApi from './config/SummaryApi.js';
import { handleAddCart } from './redux/cartStore';
import GlobalFunc from './global/globalFunc.jsx';
import CartMobile from './component/CartMobile.jsx';


function App() {

  const dispatch = useDispatch()

  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0); // Ensure page scrolls to top on every route change
  }, [location.pathname]);

  const fetchUser = async () => {
    const userData = await fetchUserDetails()
    dispatch(setUserDetails(userData.data))
  }

  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true))
      const response = await Axios({
        ...SummaryApi.getCategory
      })
      const { data: responseData } = response
      if (responseData.success) {
        dispatch(setAllCategory(responseData.data))
        // setCategoryData(responseData.data)
      }
    } catch (error) {

    } finally {
      dispatch(setLoadingCategory(false))
    }
  }

  const fetchSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getsubcategory
      })
      const { data: responseData } = response
      if (responseData.success) {
        dispatch(setAllSubCategory(responseData.data))
        // setCategoryData(responseData.data)
      }
    } catch (error) {

    } finally {

    }
  }

  const fetchRestaurant = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getRestaurant
      })
      const { data: responseData } = response
      if (responseData.success) {
        dispatch(setRestaurant(responseData.data))
        // setCategoryData(responseData.data)
      }
    } catch (error) {

    } finally {

    }
  }

  const fetchCartItem = async (params) => {
    try {
      const response = await Axios({
        ...SummaryApi.getCartItem
      })

      const { data: responseData } = response

      if (responseData.success) {
        dispatch(handleAddCart(responseData.data))
        console.log(responseData)
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchUser()
    fetchCategory()
    fetchSubCategory()
    fetchRestaurant()
  }, [])



  return (
    <GlobalFunc>
      <Header />
      <main className='min-h-[78vh] lg:mx-auto'>
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      {
        location.pathname !== '/checkout' && (

          <CartMobile />
        )
      }

    </GlobalFunc>
  )
}

export default App
