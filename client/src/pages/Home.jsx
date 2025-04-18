import React, { useState, useEffect } from 'react'
import banner from '../assets/heroo.png'
import bannerMobile from '../assets/banner-mobile.png'
import { useSelector } from 'react-redux'
import { UrlConverter } from '../utils/UrlConverter'
import { Link, useNavigate } from 'react-router-dom'
import ProductByCategory from '../component/ProductByCategory.jsx'
import Popup from '../component/PopUp.jsx'
import Axios from '../utils/axios'
import SummaryApi from '../config/SummaryApi.js'
import { Helmet } from 'react-helmet'
import { motion } from 'framer-motion'
import { IoMdTrendingUp } from "react-icons/io"
import { FaClock } from "react-icons/fa"

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  const [restaurants, setRestaurants] = useState([])
  const [review, setReview] = useState([])
  const [totalReview,setTotalReview] = useState(0)

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

  const fetchReviews = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getAllReview
      })
      const { data: responseData } = response
      if (responseData.success) {
        setReview(responseData.data)
        setTotalReview(responseData.totalReviews)
      }
    } catch (error) {

    } finally {

    }
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
    fetchReviews()
  }, [])

  return (
    <section className='bg-white'>
      <Helmet>
        <title>Khaja</title>
      </Helmet>
      {/* <div className="flex flex-col items-center justify-center">
        <Popup imageUrl={'https://res.cloudinary.com/drcjnrrbr/image/upload/v1743501006/Orange_White_Modern_Sale_Instagram_Post_bqxsfv.png'} />
      </div> */}
      <div className='container mx-auto rounded my-2 px-4'>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-orange-50 to-amber-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-16 md:py-24"
          >
            <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-200 w-fit px-2 py-1 rounded-full">
                    Free delivery on first order
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                    Delicious Food <br />
                    <span className="text-red-600">
                      Delivered Fast
                    </span>
                  </h1>
                  <p className="mt-4 text-lg text-gray-600 max-w-md">
                    Order from your favorite restaurants and enjoy the best meals delivered to your doorstep in minutes.
                  </p>
                </motion.div>



                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex items-center gap-4 mt-6"
                >
                  <div className="flex -space-x-2 overflow-hidden">
                    {review.slice(0,4).map((i, index) => (
                      <div
                        key={i._id || index}
                        className="inline-block h-10 w-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden"
                      >
                        <img
                          src={i.userId?.avatar || "/default-avatar.png"} // fallback image
                          alt="User"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="text-sm">
                    <span className="font-semibold text-orange-500">{totalReview}+</span> happy customers
                  </div>
                </motion.div>

              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="relative mx-auto max-w-md"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={banner}
                    alt="Delicious food"
                    className="w-full h-auto"
                  />

                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="absolute -right-6 top-10 bg-white p-3 rounded-xl shadow-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-orange-100 p-2 rounded-lg">
                        <div className="h-5 w-5 text-orange-500">
                          <IoMdTrendingUp size={20} />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Trending</p>
                        <p className="font-medium">Italian Pizza</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="absolute -left-6 bottom-10 bg-white p-3 rounded-xl shadow-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <div className="h-5 w-5 text-green-500">
                          <FaClock size={20} />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Delivery Time</p>
                        <p className="font-medium">30-45 min</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Decorative elements */}
          <div className="absolute -bottom-6 left-0 right-0">
            <svg xmlns="" viewBox="0 0 1440 320">
              <path
                fill="#ffffff"
                fillOpacity="1"
                d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        </section>

        {/* Shop by Category */}
        <div className='items-center justify-center flex'>
          <div className='px-4 py-1 my-2 max-w-[300px] bg-blue-100 rounded flex items-center justify-center'>
            <h1 className='font-bold text-lg lg:text-2xl'>Explore Categories</h1>
          </div>
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className=""
        >
          <section className='container mx-auto px-4 my-2 grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-2'>
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
                  <motion.div
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-blue-50 rounded-xl shadow-sm border border-gray-100 p-4 text-center hover:shadow-md transition-shadow"
                  >
                    <div key={cate._id} onClick={() => handleProductListPage(cate._id, cate.name)} className=''>
                      <img className='rounded  object-scale-down' src={cate.image} alt={cate.name} />
                      <p className='font-medium text-center lg:text-[17px] text-[12px]'>{cate.name}</p>
                    </div>
                  </motion.div>
                ))
              )
            }
          </section>
        </motion.div>

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
