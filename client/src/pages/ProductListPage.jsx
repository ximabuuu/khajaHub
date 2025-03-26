import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Axios from '../utils/axios'
import SummaryApi from '../config/SummaryApi.js'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from '../component/Loading'
import ProductCard from '../component/ProductCard'
import { useSelector } from 'react-redux'
import { UrlConverter } from '../utils/UrlConverter'

const ProductListPage = () => {

  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(1)
  const allSubCategory = useSelector(state => state.product.allSubCategory)
  const [displaySubCate, setDisplaySubCate] = useState([])

  const params = useParams()
  const subCategoryLen = params?.subCategory?.split("-")
  const subCategoryName = subCategoryLen?.slice(0, subCategoryLen?.length - 1)?.join(" ")
  const categoryId = params?.category.split("-").slice(-1)[0] || ""
  const subCategoryId = params?.subCategory.split("-").slice(-1)[0] || ""

  const fetchProductData = async () => {
    if (!categoryId || categoryId.length !== 24 || !subCategoryId || subCategoryId.length !== 24) {
      console.error("Invalid categoryId or subCategoryId format");
      return;
    }
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductByCategorySubcategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 8
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data)
        } else {
          setData([...data, ...responseData.data])
        }
        setTotalCount(responseData.totalCount)
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductData()
  }, [params, page])

  useEffect(() => {
    const sub = allSubCategory.filter(subc => {
      const filterData = subc.category.some(el => {
        return el._id === categoryId
      })
      return filterData ? filterData : null
    })
    setDisplaySubCate(sub)
  }, [params, allSubCategory])

  return (
    <section className='sticky top-32 lg:top-24'>
      <div className='container sticky top-32 mx-auto lg:px-6 grid grid-cols-[110px_1fr] md:grid-cols-[200px_1fr] lg:grid-cols-[280px_1fr] '>
        <aside className='min-h-[77.2vh] max-h-[77.2vh] overflow-auto scrollBar lg:py-4 flex flex-col gap-1'>

          {
            displaySubCate.map((scate, index) => {
              const link = `/${UrlConverter(scate?.category[0]?.name)}-${scate?.category[0]?._id}/${UrlConverter(scate.name)}-${scate._id}`
              return (
                <Link to={link} key={scate._id + index + "prod"} className={`w-full p-2 lg:py-4 cursor-pointer rounded shadow-md lg:flex lg:items-center lg:gap-4 hover:bg-red-200 
                ${subCategoryId === scate._id ? "bg-red-200" : "bg-white"}
                `}>
                  <div className='w-fit mx-auto lg:mx-2'>
                    <img src={scate.image} alt='subCategory' className='w-15  h-full object-scale-down' />
                  </div>
                  <h3 className='text-xs md:text-sm lg:text-lg text-center'>{scate.name}</h3>
                </Link>
              )
            })
          }
        </aside>

        <main className='lg:py-4'>
          <div className='bg-white shadow-md p-4 z-10'>
            <h3 className='font-semibold'>{subCategoryName}</h3>
          </div>
          <div>
            <div className='min-h-[77.2vh] max-h-[77.2vh] overflow-y-auto'>
              <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 p-4 gap-4 '>
                {
                  data.map((prod, index) => {
                    return (
                      <ProductCard data={prod} key={prod._id + index + "prod"} />
                    )
                  })
                }
              </div>
            </div>
            {
              loading && (
                <Loading />
              )
            }
          </div>
        </main>
      </div>
    </section>
  )
}

export default ProductListPage
