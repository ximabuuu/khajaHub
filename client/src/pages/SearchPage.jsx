import React, { useEffect, useState } from 'react'
import Loading from '../component/Loading'
import ProdCardByCate from '../component/ProdCardByCate'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/axios'
import SummaryApi from '../config/SummaryApi.js'
import ProductCard from '../component/ProductCard'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLocation } from 'react-router-dom'
import noData from '../assets/nodata.png'

const SearchPage = () => {

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const loadingCard = new Array(10).fill(null)
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const params = useLocation()
  const queryParams = new URLSearchParams(params.search);
  const searchText = queryParams.get('q') || '' // Change 'q' to match your actual query key



  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.searchProduct,
        data: {
          search: searchText,
          page: page
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data)
        } else {
          setData((preve) => {
            return [
              ...preve,
              ...responseData.data
            ]
          })
        }
        setTotalPage(responseData.totalPage)
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, searchText])

  const handleFetchMore = () => {
    if (totalPage > page) {
      setPage(preve => preve + 1)
    }
  }

  return (
    <section className='bg-white'>
      <div className='container mx-auto p-4'>
        <p className='font-semibold'>Search Results: {data.length}</p>


        <InfiniteScroll dataLength={data.length} hasMore={true} next={handleFetchMore}>
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4'>
            {
              data.map((p, index) => {
                return (
                  <ProductCard data={p} key={p._id + "search" + index} />
                )
              })
            }


            {
              loading && (
                loadingCard.map((_, index) => {
                  return (
                    <ProdCardByCate key={"loading" + index} />
                  )
                })
              )
            }
          </div>
        </InfiniteScroll>
        {
          // no data
          !data[0] && !loading && (
            <div className='flex flex-col justify-center items-center w-fit mx-auto  '>
              <img src={noData} alt="" className='w-full h-full max-w-sm max-h-sm' />
              <p className='font-semibold '>No Data Found</p>
              <p>Try different Keyword</p>
            </div>
          )
        }

      </div>
    </section>
  )
}

export default SearchPage
