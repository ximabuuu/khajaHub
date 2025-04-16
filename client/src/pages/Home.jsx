import React, { useState, useEffect } from 'react'
import banner from '../assets/banner.png'
import bannerMobile from '../assets/banner-mobile.png'
import { useSelector } from 'react-redux'
import { UrlConverter } from '../utils/UrlConverter'
import { Link, useNavigate } from 'react-router-dom'
import ProductByCategory from '../component/ProductByCategory.jsx'
import Popup from '../component/PopUp.jsx'
import Axios from '../utils/axios'
import SummaryApi from '../config/SummaryApi.js'
import { Helmet } from 'react-helmet'

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  const [restaurants, setRestaurants] = useState([])

  const handleProductListPage = (id, cate) => {
    const subCategory = subCategoryData.find(sub => {
      const filterData = sub.category.some(categ => categ._id === id)
      return filterData
    })
    const url = `/${UrlConverter(cate)}-${id}/${UrlConverter(subCategory.name)}-${subCategory._id}`
    navigate(url)
  }

  const handleRestaurantClick = (restro) => {
    navigate(`/restaurant/${UrlConverter(restro.name)}-${restro._id}`)
  }

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await Axios({
          ...SummaryApi.getRestaurant
        });

        if (res.data && Array.isArray(res.data.data)) {
          setRestaurants(res.data.data);
        } else {
          console.warn("Unexpected restaurant data format:", res.data);
          setRestaurants([])
        }
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setRestaurants([])
      }
    }

    fetchRestaurants()
  }, [])

  return (
    <section className='bg-white'>
      <Helmet>
        <title>Khaja</title>
      </Helmet>
      <div className="flex flex-col items-center justify-center">
        <Popup imageUrl={'https://res.cloudinary.com/drcjnrrbr/image/upload/v1743501006/Orange_White_Modern_Sale_Instagram_Post_bqxsfv.png'} />
      </div>
      <div className='container mx-auto rounded my-2 px-4'>
        <div className='w-full px-4 h-full min-h-33 lg:min-h-48 bg-white rounded'>
          <img src={banner} alt="banner" className='w-full h-full hidden lg:block md:block rounded' />
          <img src={bannerMobile} alt="banner" className='w-full h-full lg:hidden md:hidden rounded' />
        </div>

        {/* Shop by Category */}
        <div className='items-center justify-center flex'>
          <div className='px-4 py-1 my-2 max-w-[300px] bg-blue-100 rounded flex items-center justify-center'>
            <h1 className='font-bold text-lg lg:text-2xl'>Shop by Category</h1>
          </div>
        </div>
        <div className='container mx-auto px-4 my-2 grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-2'>
          {
            loadingCategory ? (
              new Array(12).fill(null).map((cat, index) => (
                <div key={index} className='bg-white rounded p-4 grid gap-2 shadow animate-pulse'>
                  <div className='bg-blue-100 rounded h-6'></div>
                  <div className='bg-blue-100 rounded h-4'></div>
                </div>
              ))
            ) : (
              categoryData.map((cate) => (
                <div key={cate._id} onClick={() => handleProductListPage(cate._id, cate.name)} className='flex flex-col items-center bg-blue-100 w-24 lg:w-38 p-2 hover:shadow-md cursor-pointer'>
                  <img className='rounded w-32 object-scale-down' src={cate.image} alt={cate.name} />
                  <p className='font-medium text-center'>{cate.name}</p>
                </div>
              ))
            )
          }
        </div>

        {/* Featuring Restaurants */}
        <div className='items-center justify-center flex'>
          <div className='px-4 py-1 my-4 max-w-[320px] bg-red-100 rounded flex items-center justify-center'>
            <h1 className='font-bold text-lg lg:text-2xl'>Featuring Restaurants</h1>
          </div>
        </div>
        <div className='container mx-auto px-4 my-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
          {
            restaurants.length > 0 ? (
              restaurants.map((restro) => (
                <div key={restro._id} onClick={() => handleRestaurantClick(restro)} className='bg-white p-3 rounded shadow hover:shadow-md cursor-pointer'>
                  <h2 className='font-semibold text-sm text-center'>{restro.name}</h2>
                </div>
              ))
            ) : (
              <p className='text-center col-span-full text-gray-500'>No restaurants to show</p>
            )
          }
        </div>

        {/* Products by Category */}
        {
          categoryData.map((cat) => (
            <ProductByCategory key={cat._id} id={cat._id} name={cat.name} />
          ))
        }

      </div>
    </section>
  )
}

export default Home
