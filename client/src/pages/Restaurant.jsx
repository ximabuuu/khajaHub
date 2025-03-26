import React from 'react'
import { useState } from 'react'
import Axios from '../utils/axios'
import { useEffect } from 'react'
import SummaryApi from '../config/SummaryApi'
import NoData from '../component/NoData'
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import AddRestro from '../component/AddRestro'
import EditRestro from '../component/EditRestro'
import DeleteConf from '../component/DeleteConf'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'

const Restaurant = () => {

  const [restroData,setRestroData] = useState([])
  const [openAdd,setOpenAdd] = useState(false)
  const [openEdit,setOpenEdit] = useState(false)
  const [editData,setEditData] = useState({
    name : ""
  })
  const [openDelete,setOpenDelete] = useState(false)
  const [deleteCat,setDeleteCat] = useState({
    _id : ""
  })

  const fetchCategory = async()=>{
    try {
        const response = await Axios({
            ...SummaryApi.getRestaurant
        })
        const {data : responseData} = response
        if (responseData.success) {
            setRestroData(responseData.data)
        }
    } catch (error) {
        
    }finally{
        
    }
}

useEffect(()=>{
    fetchCategory()
},[])

const handleDeleteCat = async ()=>{
        try {
            const response = await Axios({
                ...SummaryApi.deleteREstaurant,
                data : deleteCat
            })

            const { data : responseData} = response

            if (responseData.success) {
                toast.success(responseData.message)
                setOpenDelete(false)
                fetchCategory()
                
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

  return (
    <section>
      <div className='p-2 bg-white shadow-md flex items-center justify-between'>
        <h2 className='font-semibold'>Restaurants</h2>
        <button onClick={()=>setOpenAdd(true)} className='text-sm border border-red-800 hover:bg-red-800 rounded px-3 py-1 hover:text-white'>Add Restaurant</button>
      </div>
      <div className='p-1 my-1 flex items-center justify-between bg-blue-100 px-4 border border-blue-200 gap-2'>
        <h1 className='font-medium'>Name</h1>
        <h1 className='font-medium'>Edit</h1>
      </div>
      {
        !restroData[0]&& (
                
          <NoData/>
        )
      }
      <div>
        {
          restroData.map((restro,index)=>{
            return(
              <div key={restro._id} className='flex items-center justify-between p-2 border border-blue-200'>
                <div>
                  <h1>{restro.name}</h1>
                </div>
                <div className='flex gap-2'>
                  <button onClick={()=>{
                    setOpenEdit(true) 
                    setEditData(restro)
                    }} className='hover:text-green-800'><MdEdit size={20} /></button>
                  <button onClick={()=>{
                    setOpenDelete(true)
                    setDeleteCat(restro)
                    }} className='hover:text-red-800'><MdDelete size={20} /></button>
                </div>
              </div>
            )
          })
        }
      </div>
      {
        openAdd && (
          <AddRestro fetchData={fetchCategory} close={()=>setOpenAdd(false)}/>
        )
      }
      {
        openEdit && (
          <EditRestro data={editData} close={()=>setOpenEdit(false)} fetchData={fetchCategory}/>
        )
      }
      {
        openDelete && (
          <DeleteConf fetchData={fetchCategory} close={()=>setOpenDelete(false)} cancel={()=>setOpenDelete(false)} confirm={handleDeleteCat}/>
        )
      }
    </section>
  )
}

export default Restaurant
