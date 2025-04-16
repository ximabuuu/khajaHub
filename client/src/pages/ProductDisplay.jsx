import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError.js'
import Axios from '../utils/axios.js'
import SummaryApi from '../config/SummaryApi.js'
import { GrFormPreviousLink } from "react-icons/gr";
import { GrFormNextLink } from "react-icons/gr";
import { MdDeliveryDining } from "react-icons/md";
import Divider from '../component/Divider.jsx'
import deliver from '../assets/30min.png'
import bestPrice from '../assets/bestPrice.png'
import { DiscountedPrice } from '../utils/DiscountedPrice'
import AddToCart from '../component/AddToCart.jsx'
import assortment from '../assets/assortment.png'

const ProductDisplay = () => {

  const params = useParams()
  let productId = params?.product?.split("-")?.slice(-1)[0]
  const [data, setData] = useState({
    name: "",
    image: [],

  })
  const [image, setImage] = useState(0)
  const [loading, setLoading] = useState(false)
  const imageContainer = useRef()
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [userId, setUserId] = useState();
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);



  const fetchReviews = async () => {
    try {
      console.log(productId)
      const response = await Axios({
        ...SummaryApi.getReview,
        params: { productId }
      });

      if (response.data.success) {
        setReviews(response.data.data)
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };


  const handleReviewSubmit = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.addReview,
        data: {
          productId,
          userId,
          rating,
          comment: reviewText,
        }
      });

      if (response.data.success) {
        setReviewText("")
        fetchReviews()
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }


  const handleNext = () => {
    imageContainer.current.scrollLeft += 100
  }

  const handlePrev = () => {
    imageContainer.current.scrollLeft -= 100
  }

  const fetchProductDetails = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productId
        }
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
    fetchReviews();
  }, [params, productId]);


  return (
    <section className='container  p-4 grid lg:grid-cols-2 lg:px-10 '>
      {/* left part */}
      <div className=' '>
        <div className='bg-white lg:min-h-[67vh] lg:max-h-[67vh] min-h-56 max-h-56 rounded h-full w-full '>
          <img src={data.image[image]} alt="Product Image" className='h-full w-full object-scale-down' />
        </div>
        <div className='flex justify-center items-center gap-3 my-2'>
          {
            data.image.map((img, index) => {
              return (
                <div key={img + index + "point"} className={`bg-red-200 w-3 h-3 lg:w-5 lg:h-5 rounded-full ${index === image && "bg-red-300"}`}>

                </div>
              )
            })
          }
        </div>
        <div className='grid relative'>
          <div ref={imageContainer} className='flex gap-4 relative z-10 w-full overflow-x-auto'>
            {
              data.image.map((img, index) => {
                return (
                  <div className='rounded w-20 min-h-20 min-w-20 lg:min-h-30 lg:min-w-30 scrollBarNone h-20 lg:w-30 lg:h-30 shadow-md cursor-pointer' key={img + index}>
                    <img src={img} alt=""
                      className='w-full h-full object-scale-down'
                      onClick={() => setImage(index)}
                    />
                  </div>
                )
              })
            }
          </div>
          <div className='w-full  h-full flex justify-between absolute items-center'>
            <button onClick={handlePrev} className='z-10 bg-white relative p-1 rounded-full shadow-md '>
              <GrFormPreviousLink size={25} />
            </button>
            <button onClick={handleNext} className='z-10 bg-white relative p-1 rounded-full shadow-md '>
              <GrFormNextLink size={25} />
            </button>
          </div>
        </div>
        <div className='my-2 hidden lg:grid gap-3'>
          <div>
            <p className='font-semibold'>Descriptions</p>
            <p className='text-base'>{data.description}</p>
          </div>
          {
            data?.more_details && Object.keys(data?.more_details).map((ele, index) => {
              return (
                <div>
                  <p className='font-semibold'>{ele}</p>
                  <p className='text-base'>{data?.more_details[ele]}</p>
                </div>
              )
            })
          }
        </div>
      </div>
      {/* right part */}
      <div className='p-4 lg:pl-7 text-base lg:text-lg'>
        <p className='flex gap-2 bg-red-200 w-fit px-2 rounded-full'><MdDeliveryDining size={28} />30 Min</p>
        <h2 className='font-semibold text-lg lg:text-3xl'>{data.name}</h2>
        <p className='font-mono'>{data.unit}</p>
        <p className='font-mono'>Average Ratings: ({data.averageRating})⭐</p>
        <Divider />
        
        <select
          onChange={(e) => {
            const selected = data.restaurant.find(r => r._id === e.target.value);
            setSelectedRestaurant(selected);
          }}
          value={selectedRestaurant?._id || ''}
          className='p-2 rounded border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-red-400'
        >
          <option value='' disabled>Select a Restaurant/Store</option>
          {data.restaurant?.map((r) => (
            <option key={r._id} value={r._id}>
              {r.name}
            </option>
          ))}
        </select>

        <Divider />
        <p>Price</p>
        <div className='flex items-center gap-2 lg:gap-4'>
          <div className='border border-red-800 px-4 py-2 rounded bg-red-50 w-fit'>
            <p className='font-semibold text-lg lg:text-xl'>Rs. {DiscountedPrice(data.price, data.discount)}</p>
          </div>
          {
            data.discount !== 0 && (
              <p className='line-through'>Rs. {data.price}</p>
            )
          }
          {
            data.discount !== 0 && (
              <p className='text-red-800 font-bold lg:text-2xl'>{data.discount}% <span className='text-base text-neutral-500'>Discount</span></p>
            )
          }
        </div>
        <div className='my-2'>
          <AddToCart data={data} selectedRestaurant={selectedRestaurant} />
        </div>           


        <Divider />
        <h2 className='font-semibold'>Why order from Khaja?</h2>
        <div>
          <div className='flex items-center gap-4 my-2'>
            <img src={deliver} alt="Fast Delivery" className='w-20 h-20' />
            <div className='text-sm'>
              <div className='font-semibold'>Ultra-Fast Delivery</div>
              <p>Get Your order delivered to your doorstep from Khaja.</p>
            </div>
          </div>
        </div>
        <div>
          <div className='flex items-center gap-4 my-2'>
            <img src={bestPrice} alt="Best prices" className='w-20 h-20' />
            <div className='text-sm'>
              <div className='font-semibold'>Best Prices & Offers</div>
              <p>Get the best prices and exclusive offers - shop now from Khaja and save big!</p>
            </div>
          </div>
        </div>
        <div>
          <div className='flex items-center gap-4 my-2'>
            <img src={assortment} alt="Varied Assortment" className='w-20 h-20' />
            <div className='text-sm'>
              <div className='font-semibold'>Varied Assortment</div>
              <p>Enjoy a varied assortment of cuisines from multiple restaurants.</p>
            </div>
          </div>
        </div>
        <div className='my-2 lg:hidden grid gap-3'>
          <div>
            <p className='font-semibold'>Descriptions</p>
            <p className='text-base'>{data.description}</p>
          </div>
          {
            data?.more_details && Object.keys(data?.more_details).map((ele, index) => {
              return (
                <div>
                  <p className='font-semibold'>{ele}</p>
                  <p className='text-base'>{data?.more_details[ele]}</p>
                </div>
              )
            })
          }
        </div>
        <Divider />
        <h2 className='font-semibold'>Customer Reviews</h2>

        {/* Review List */}
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className='p-2 border rounded my-2'>
              <p className='font-semibold'>{review.userId.name}</p>
              <p className='text-yellow-500'>{"⭐".repeat(review.rating)}</p>
              <p>{review.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to review!</p>
        )}

        {/* Add Review Form */}
        <div className='mt-4'>
          <h3 className='font-semibold'>Write a Review</h3>
          <div className='flex gap-2 my-2'>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className='p-2 border rounded'>
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>{star} Star</option>
              ))}
            </select>
          </div>
          <textarea
            className='w-full p-2 border rounded'
            rows='3'
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder='Write your review here...'
          />
          <button onClick={handleReviewSubmit} className='mt-2 px-4 py-2 bg-red-800 text-white rounded hover:bg-red-600'>
            Submit Review
          </button>
        </div>

      </div>
    </section>
  )
}

export default ProductDisplay
