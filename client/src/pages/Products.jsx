import React, { useEffect, useState } from 'react'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/axios'
import SummaryApi from '../config/SummaryApi.js'
import Loading from '../component/Loading'
import ProductCardAdmin from '../component/ProductCardAdmin'
import { GrFormPreviousLink } from "react-icons/gr";
import { GrFormNextLink } from "react-icons/gr";
import { FaSearch } from "react-icons/fa";

const Products = () => {

  const [ProductData,setProductData] = useState([])
  const [page,setPage] = useState(1)
  const [loading,setLoading] = useState(false)
  const [totalPageCount,setTotalPageCount] = useState(1)
  const [search,setSearch] = useState("")

  const fetchProductData = async ()=>{
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProduct,
        params : {
          page,
          limit : 12,
          search : search
        }
      })

      const {data : responseData} = response

      console.log("all",responseData)

      if (responseData.success) {
        setTotalPageCount(responseData.totalNoPage)
        setProductData(responseData.data)
      }

    } catch (error) {
      AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }
  
  useEffect(()=>{
    setProductData([])
    fetchProductData()
  },[page])

  const handleNext = () => {
    if (page < totalPageCount) {
      setPage((prev) => prev + 1);
    }
  }

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  }

  const handleOnChange = (e)=>{
    const {value} = e.target
    setSearch(value)
    setPage(1)
  }

  useEffect(()=>{
    let flag = true
    const interval = setTimeout(()=>{
      if (flag) {
        fetchProductData()
        flag = false
      }
    },300);
    return()=>{
      clearTimeout(interval)
    }
  },[search])

  console.log("search",search)


  return (
    <section>
      <div className='p-2 bg-white shadow-md flex items-center justify-between gap-2'>
        <h2 className='font-semibold'>Products</h2>
        <div className='min-w-24 max-w-56 w-full h-full ml-auto flex items-center gap-2 bg-blue-50 px-4 rounded border border-slate-200 focus-within:border-red-800'>
          <FaSearch size={20} />
          <input onChange={handleOnChange} value={search} type="text" className='w-full h-full py-2 bg-blue-50 outline-none' placeholder='Search Product...' />
        </div>
      </div>
      {
        loading && (
          <Loading/>
        )
      }
      <div className='lg:p-4'>
        <div className='min-h-[55vh]'>
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6'>
            {
              ProductData.map((p,index)=>{
                return(
                  <div key={index}>
                    <ProductCardAdmin data={p} fetchProductData={fetchProductData}/>
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className='flex justify-between my-4'>
          <button onClick={handlePrev} className='border border-red-800 px-3 rounded py-1 hover:bg-red-800 hover:text-white'><GrFormPreviousLink size={25} /></button>
          <button>{page}/{totalPageCount}</button>
          <button onClick={handleNext} className='border border-red-800 px-3 rounded py-1 hover:bg-red-800 hover:text-white'><GrFormNextLink size={25} /></button>
        </div>
      </div>
    </section>
  )
}

export default Products
