"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ChevronLeft, ChevronRight, Clock, Star, StarHalf, Truck } from "lucide-react"
import AxiosToastError from "../utils/AxiosToastError.js"
import Axios from "../utils/axios.js"
import SummaryApi from "../config/SummaryApi.js"
import { DiscountedPrice } from "../utils/DiscountedPrice"
import AddToCart from "../component/AddToCart.jsx"

const ProductDisplay = () => {
  const params = useParams()
  const productId = params?.product?.split("-")?.slice(-1)[0]

  const [data, setData] = useState({
    name: "",
    image: [],
    price: 0,
    discount: 0,
    description: "",
    unit: "",
    averageRating: 0,
    restaurant: [],
    more_details: {},
  })

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [reviews, setReviews] = useState([])
  const [reviewText, setReviewText] = useState("")
  const [rating, setRating] = useState(5)
  const [userId, setUserId] = useState()
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)

  const fetchReviews = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getReview,
        params: { productId },
      })

      if (response.data.success) {
        setReviews(response.data.data)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleReviewSubmit = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.addReview,
        data: {
          productId,
          userId,
          rating,
          comment: reviewText,
        },
      })

      if (response.data.success) {
        setReviewText("")
        fetchReviews()
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const fetchProductDetails = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productId,
        },
      })
      const { data: responseData } = response

      if (responseData.success) {
        setData(responseData.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductDetails()
    fetchReviews()
  }, [params, productId])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % data.image.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + data.image.length) % data.image.length)
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="fill-yellow-400 text-yellow-400 w-4 h-4" />)
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="fill-yellow-400 text-yellow-400 w-4 h-4" />)
    }

    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="text-gray-300 w-4 h-4" />)
    }

    return stars
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-800"></div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-500">
          <button onClick={() => window.history.back()} className="hover:text-red-800 flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Images Section */}
            <div className="p-4 md:p-8">
              {/* Main Image */}
              <div className="relative bg-gray-50 rounded-lg overflow-hidden mb-4 aspect-square">
                {data.image.length > 0 && (
                  <img
                    src={data.image[currentImageIndex] || "/placeholder.svg"}
                    alt={data.name}
                    className="w-full h-full object-contain"
                  />
                )}

                {data.image.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all md:left-4"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all md:right-4"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                  </>
                )}
              </div>

              {/* Image Thumbnails */}
              {data.image.length > 1 && (
                <div className="flex gap-2 overflow-auto pb-2 scrollbar-hide">
                  {data.image.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative min-w-[60px] sm:min-w-[70px] w-[60px] sm:w-[70px] h-[60px] sm:h-[70px] rounded-md overflow-hidden border-2 ${currentImageIndex === index ? "border-red-800" : "border-transparent"}`}
                    >
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Image Indicators */}
              {data.image.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {data.image.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`rounded-full aspect-square ${currentImageIndex === index ? "bg-red-800" : "bg-gray-300"} 
          h-[8px] w-[8px] min-h-[8px] min-w-[8px]`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div className="p-4 md:p-8 md:pr-8 border-t md:border-t-0 md:border-l border-gray-100">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{data.name}</h1>

              {data.unit && <p className="text-gray-500 mb-2">{data.unit}</p>}

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {renderStars(data.averageRating)}
                  <span className="text-sm text-gray-600 ml-1">({data.averageRating})</span>
                </div>

                <div className="flex items-center gap-1 text-gray-600 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>30 Min Delivery</span>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-gray-700">{data.description}</p>
              </div>

              {/* Restaurant Selection */}
              <div className="mb-6">
                <label htmlFor="restaurant" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Restaurant/Store
                </label>
                <select
                  id="restaurant"
                  onChange={(e) => {
                    const selected = data.restaurant.find((r) => r._id === e.target.value)
                    setSelectedRestaurant(selected)
                  }}
                  value={selectedRestaurant?._id || ""}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-red-800 bg-white"
                >
                  <option value="" disabled>
                    Select a Restaurant/Store
                  </option>
                  {data.restaurant?.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Section */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Price</h2>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-red-800">
                    Rs. {DiscountedPrice(data.price, data.discount)}
                  </span>

                  {data.discount > 0 && (
                    <>
                      <span className="text-gray-500 line-through">Rs. {data.price}</span>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-semibold">
                        {data.discount}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="mb-8">
                <AddToCart productId={data} selectedRestaurant={selectedRestaurant} />
              </div>

              {/* Additional Details */}
              {Object.keys(data.more_details || {}).length > 0 && (
                <div className="border-t border-gray-100 pt-6 mb-6">
                  <h2 className="text-lg font-semibold mb-4">Additional Details</h2>
                  <div className="grid gap-4">
                    {Object.entries(data.more_details || {}).map(([key, value]) => (
                      <div key={key}>
                        <h3 className="font-medium text-gray-900">{key}</h3>
                        <p className="text-gray-700">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Why Order Section */}
          <div className="border-t border-gray-100 p-4 md:p-8">
            <h2 className="text-xl font-semibold mb-4">Why Order From Us?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-4">
                <div className="bg-red-50 p-3 rounded-full">
                  <Truck className="w-6 h-6 text-red-800" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Ultra-Fast Delivery</h3>
                  <p className="text-gray-600 text-sm">
                    Get your order delivered to your doorstep quickly and efficiently.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-red-50 p-3 rounded-full">
                  <svg className="w-6 h-6 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Best Prices & Offers</h3>
                  <p className="text-gray-600 text-sm">
                    Get the best prices and exclusive offers - save big on every order!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-red-50 p-3 rounded-full">
                  <svg className="w-6 h-6 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Varied Assortment</h3>
                  <p className="text-gray-600 text-sm">
                    Enjoy a varied assortment of cuisines from multiple restaurants.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t border-gray-100 p-4 md:p-8">
            <h2 className="text-xl font-semibold mb-6">Customer Reviews</h2>

            {/* Review List */}
            {reviews.length > 0 ? (
              <div className="grid gap-4 mb-8">
                {reviews.map((review, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{review.userId.name}</h3>
                      <div className="flex items-center">{renderStars(review.rating)}</div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg mb-8">
                <p className="text-gray-500">No reviews yet. Be the first to review!</p>
              </div>
            )}

            {/* Add Review Form */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Write a Review</h3>

              <div className="mb-4">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                      <Star
                        className={`w-6 h-6 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  id="review"
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-red-800"
                  placeholder="Share your experience with this product..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
              </div>

              <button
                onClick={handleReviewSubmit}
                className="w-full md:w-auto px-6 py-3 bg-red-800 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDisplay
