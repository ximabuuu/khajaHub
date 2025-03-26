import React, { useState } from 'react'
import EditProductAdmin from './EditProductAdmin'
import DeleteConf from './DeleteConf'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/axios'
import SummaryApi from '../config/SummaryApi.js'
import toast from 'react-hot-toast'

const ProductCardAdmin = ({data,fetchProductData}) => {

  const [openEdit,setOpenEdit] = useState(false)
  const [openDelete,setOpenDelete] = useState(false)

  const handleDelete = async ()=>{
    try {
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data : {
          _id : data._id
        }
      })

      const {data : responseData} = response
      if (responseData.success) {
        toast.success(responseData.message)
        fetchProductData()
        setOpenDelete(false)
      }

    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <div className='w-36 lg:w-42  items-center bg-blue-50 rounded m-2 hover:shadow-md'>
      <div className='w-36 lg:w-42 p-2'>
      <div>
        <img src={data?.image[0]} alt={data?.name} className='w-full h-full object-scale-down rounded' />
      </div>
      <div className=''>
        <p className='text-ellipsis line-clamp-1 font-medium'>{data?.name}</p>
        <p className='text-slate-600'>{data?.unit}</p>
      </div>
      <div className='flex items-center justify-between my-2'>
        <button onClick={()=>setOpenEdit(true)} className='bg-green-300 lg:px-2 px-1 text-[15px] rounded-2xl cursor-pointer hover:bg-green-500'>edit</button>
        <button onClick={()=>setOpenDelete(true)} className='bg-red-300 lg:px-2 px-1 text-[15px] rounded-2xl cursor-pointer hover:bg-red-500'>delete</button>
      </div>
      </div>
      {
        openEdit && (
          <EditProductAdmin fetchProductData={fetchProductData} data={data} close={()=>setOpenEdit(false)}/>
        )
      }
      {
        openDelete && (
          <DeleteConf close={()=>setOpenDelete(false)} cancel={()=>setOpenDelete(false)} confirm={handleDelete}/>
        )
      }
    </div>
  )
}

export default ProductCardAdmin
