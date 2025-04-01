import React from 'react'
import banner from '../assets/banner.png'
import bannerMobile from '../assets/banner-mobile.png'
import { useSelector } from 'react-redux'
import { UrlConverter } from '../utils/UrlConverter'
import { Link, useNavigate } from 'react-router-dom'
import ProductByCategory from '../component/ProductByCategory.jsx'
import Popup from '../component/PopUp.jsx'

const Home = () => {

  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  const handleProductListPage = (id, cate) => {
    const subCategory = subCategoryData.find(sub => {
      const filterData = sub.category.some(categ => {
        return categ._id == id
      })

      return filterData ? true : null

    })
    const url = `/${UrlConverter(cate)}-${id}/${UrlConverter(subCategory.name)}-${subCategory._id}`
    navigate(url)

  }

  return (
    <section className='bg-white'>
      <div className="flex flex-col items-center justify-center">
        {/* Popup Component */}
        <Popup imageUrl={'https://res.cloudinary.com/drcjnrrbr/image/upload/v1743501006/Orange_White_Modern_Sale_Instagram_Post_bqxsfv.png'}/>
      </div>
      <div className='container mx-auto rounded my-2 px-4'>
        <div className={`w-full h-full min-h-33 lg:min-h-48 bg-blue-100 rounded`}>
          <img src={banner} alt="banner" className='w-full h-full hidden lg:block md:block rounded' />
          <img src={bannerMobile} alt="banner" className='w-full h-full lg:hidden md:hidden rounded' />
        </div>
        <div className='items-center justify-center flex'>
          <div className='px-4 py-1 my-2 max-w-[300px] bg-blue-100 rounded flex items-center justify-center'>
            <h1 className='font-bold text-lg lg:text-2xl'>Shop by Category</h1>
          </div>
        </div>
        <div className='container mx-auto px-4 my-2 grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-2 '>

          {
            loadingCategory ? (
              new Array(12).fill(null).map((cat, index) => {
                return (
                  <div key={index + "categoryLoad"} className='bg-white rounded p-4   grid gap-2 shadow animate-pulse'>
                    <div className='bg-blue-100 rounded'></div>
                    <div className='bg-blue-100 rounded'></div>

                  </div>
                )
              })
            ) : (
              categoryData.map((cate, index) => (
                <div>
                  <div key={cate._id + "loadCate"} onClick={() => handleProductListPage(cate._id, cate.name)} className='flex flex-col items-center lg:bg-blue-100 w-24 lg:w-38 p-2 hover:shadow-md'>
                    <img className='rounded w-32 object-scale-down' src={cate.image} alt="" />
                    <p className='font-sm md:font-medium lg:font-semibold'>{cate.name}</p>
                  </div>
                </div>
              ))
            )

          }
        </div>

        {
          categoryData.map((cat, index) => {
            return (
              <ProductByCategory key={cat?._id + "productbycate"} id={cat._id} name={cat.name} />
            )
          })
        }

      </div>
    </section>
  )
}

export default Home
