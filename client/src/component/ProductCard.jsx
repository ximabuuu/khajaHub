import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { UrlConverter } from '../utils/UrlConverter'
import { MdDeliveryDining } from "react-icons/md"
import { DiscountedPrice } from '../utils/DiscountedPrice'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/axios'
import SummaryApi from '../config/SummaryApi.js'
import toast from 'react-hot-toast'
import { useGlobalContext } from '../global/globalFunc'
import AddToCart from './AddToCart'

const ProductCard = ({ data, selectedRestaurant }) => {

  const url = `/product/${UrlConverter(data.name)}-${data._id}`
  const [loading, setLoading] = useState(false)
  const { fetchCartItem } = useGlobalContext()

  const handleAdd = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.addtocart,
        data: {
          productId: data?._id,
          restaurant: selectedRestaurant?._id
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        if (fetchCartItem) {
          fetchCartItem()
        }
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Link to={url} className="transform transition-transform duration-300 hover:scale-105">
      <div className='border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-shadow duration-300 p-4 rounded-2xl grid gap-3 min-w-52 max-w-64'>
        <div className='aspect-square w-full overflow-hidden rounded-xl'>
          <img
            src={data.image[0]}
            alt="product image"
            className='w-full h-full object-cover rounded-xl hover:scale-105 transition-transform duration-300'
          />
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex gap-1 items-center text-xs px-2 py-1 text-red-700 bg-red-100 rounded'>
            <MdDeliveryDining size={16} /> 30 Mins
          </div>
          {
            data.discount !== 0 && (
              <div className='text-xs font-semibold px-2 py-1 bg-yellow-100 text-yellow-700 rounded'>
                {data.discount}% off
              </div>
            )
          }
        </div>

        <h3 className='font-semibold text-sm lg:text-base line-clamp-1'>
          {data.name}
        </h3>

        <div className='text-sm text-gray-600 flex justify-between'>
          <span>{data.unit}</span>
          <span>⭐ {data.averageRating}</span>
        </div>

        <div className='flex items-center justify-between'>
          <div className='text-base font-bold text-gray-800'>
            Rs. {DiscountedPrice(data.price, data.discount)}
          </div>
          <div className='bg-red-800 hover:bg-red-600 text-white lg:px-4 py-1 px-2  rounded'>
            Add
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
