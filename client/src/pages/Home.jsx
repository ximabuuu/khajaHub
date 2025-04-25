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
import '../App.css'
import { ChevronRight, Clock, TrendingUp } from 'lucide-react'

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  const [restaurants, setRestaurants] = useState([])
  const [review, setReview] = useState([])
  const [totalReview, setTotalReview] = useState(0)

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
        <section className="relative overflow-hidden">
          {/* Background with texture and gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/90 via-red-800/85 to-amber-700/80 z-0">
            {/* Texture overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          {/* Food pattern overlay */}
          <div className="absolute inset-0 bg-repeat opacity-5 z-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              className="text-white"
              viewBox="0 0 80 80"
              preserveAspectRatio="none"
            >
              <path
                d="M30 40c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10zM10 40c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10zM50 40c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </div>

          <div className="container mx-auto px-4 py-16 md:py-24 lg:py-28 relative z-10">
            <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
              {/* Left Column - Text Content */}
              <div className="space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <div className="inline-flex items-center gap-2 mb-4 bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-medium border border-white/30">
                    <span className="animate-pulse h-2 w-2 rounded-full bg-white"></span>
                    Free delivery on first order
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                    Delicious Food{" "}
                    <span className="relative">
                      <span className="relative z-10">Delivered Fast</span>
                      <span className="absolute bottom-2 left-0 w-full h-3 bg-amber-400/40 rounded-full -z-0"></span>
                    </span>
                  </h1>
                  <p className="mt-4 text-lg text-white/90 max-w-md">
                    Order from your favorite restaurants and enjoy the best meals delivered to your doorstep in minutes.
                  </p>
                </motion.div>


                {/* Customer Reviews */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex items-center gap-4 mt-6"
                >
                  <div className="flex -space-x-2 overflow-hidden">
                    {review.slice(0,4).map((review, index) => (
                      <div
                        key={review?._id || index}
                        className="inline-block h-10 w-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-md"
                      >
                        <img
                          src={review?.userId?.avatar || "/placeholder.svg?height=40&width=40"}
                          alt="User"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="text-sm text-white">
                    <span className="font-semibold text-amber-300">2000+</span> happy customers
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <Link
                    to="/menu"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-full text-lg font-semibold shadow-md hover:shadow-xl transition-all duration-300 group"
                  >
                    Browse Menu
                    <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </motion.div>

              </div>

              {/* Right Column - Hero Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="relative mx-auto max-w-md md:max-w-none"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-2 border border-white/20">
                  <div className="rounded-xl overflow-hidden">
                    <img
                      src={banner}
                      alt="Delicious food"
                      className="w-full h-auto rounded-xl"
                    />
                  </div>

                  {/* Floating Cards */}
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="absolute -right-6 top-10 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-white/50"
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-amber-100 p-2 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Trending</p>
                        <p className="font-medium text-gray-800">Italian Pizza</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="absolute -left-6 bottom-10 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-white/50"
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Clock className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Delivery Time</p>
                        <p className="font-medium text-gray-800">30-45 min</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Decorative elements */}
                  <div className="absolute -z-10 -top-10 -right-10 w-40 h-40 bg-amber-400/30 rounded-full blur-3xl"></div>
                  <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-red-500/20 rounded-full blur-3xl"></div>
                </div>

                {/* Decorative floating elements */}
                <div className="absolute -z-10 top-1/4 -right-12 w-24 h-24 bg-amber-300/20 rounded-full blur-xl animate-pulse"></div>
                <div
                  className="absolute -z-10 bottom-1/3 -left-12 w-32 h-32 bg-red-400/20 rounded-full blur-xl animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
              </motion.div>
            </div>
          </div>

          {/* Wave Separator */}
          <div className="absolute -bottom-1 left-0 right-0 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
              <path
                fill="currentColor"
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
