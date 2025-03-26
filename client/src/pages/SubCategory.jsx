import React, { useEffect, useState } from 'react'
import AddSubCategory from '../component/AddSubCategory'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/axios'
import SummaryApi from '../config/SummaryApi.js'
import TableDisplay from '../component/TableDisplay'
import {createColumnHelper} from '@tanstack/react-table'
import ViewImage from '../component/ViewImage'
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import EditSubCategory from '../component/EditSubCategory'
import DeleteConf from '../component/DeleteConf'

const SubCategory = () => {

  const [openAddSubCategory,setOpenAddSubCategory] = useState(false)
  const [subcatData,setSubCatData] = useState([])
  const [loading,setLoading] = useState(false)
  const columnHelper = createColumnHelper()
  const [imageUrl,setImageUrl] = useState("")
  const [openEdit,setOpenEdit] = useState(false)
  const [editData,setEditData] = useState({
    _id : ""
  })
  const [openDelete,setOpenDelete] = useState(false)
  const [deleteCat,setDeleteCat] = useState({
    _id : ""
  })

  const fetchSubCategory = async ()=>{
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getsubcategory
      })
      const {data : responseData} = response

      if (responseData.success) {
        setSubCatData(responseData.data)
      }

    } catch (error) {
      AxiosToastError(error)
    } finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchSubCategory()
  },[])
  const handleDeleteCat = async ()=>{
    try {
        const response = await Axios({
            ...SummaryApi.deletesubcategory,
            data : deleteCat
        })

        const { data : responseData} = response

        if (responseData.success) {
          toast.success(responseData.message);
          setSubCatData((prev) => prev.filter((sub) => sub._id !== deleteCat._id)); // Remove from UI instantly
          setOpenDelete(false);
      }
      

    } catch (error) {
        AxiosToastError(error)
    }
}

  const column = [
    columnHelper.accessor('name',{
      header : "Name"
    }),
    columnHelper.accessor('image',{
      header : "Image",
      cell : ({row})=>{
        return <div className='flex justify-center items-center'>
          <img src={row.original.image} alt={row.original.name} className='w-8 h-8 cursor-pointer' onClick={()=>{
            setImageUrl(row.original.image)
          }} />
        </div>
      }
    }),
    columnHelper.accessor('category',{
      header : "Category",
      cell : ({row})=>{
        return (
          <>
            {
              row.original.category.map((c,index)=>{
                return(
                  <p key={c._id+"table"} className='shadow-md px-1'>{c.name}</p>
                )
              })
            }
          </>
        )
      }
    }),
    columnHelper.accessor("_id",{
      header : "Edit",
      cell : ({row})=>{
        return(
          <div className='flex items-center justify-center gap-3'>
            <button onClick={()=>{
              setOpenEdit(true)
              setEditData(row.original)
            }} className='hover:text-green-800'><MdEdit size={20} /></button>
            <button onClick={()=>{
              setOpenDelete(true)
              setDeleteCat(row.original)
            }} className='hover:text-red-800'><MdDelete size={20} /></button>
          </div>
        )
      }
    })
  ]

  return (
    <section>
      <div className='p-2 bg-white shadow-md flex items-center justify-between'>
            <h2 className='font-semibold'>Sub Category</h2>
            <button onClick={()=>setOpenAddSubCategory(true)} className='text-sm border border-red-800 hover:bg-red-800 rounded px-3 py-1 hover:text-white'>Add Sub Category</button>
        </div>
        <div className='overflow-x-auto overflow-y-auto w-full max-w-[85vw] max-h-[60vh]'>
          <TableDisplay data={subcatData} column={column} />
        </div>
        {
          openAddSubCategory && (
            <AddSubCategory
              close={()=>setOpenAddSubCategory(false)}
              fetchData={fetchSubCategory}
            />
          )
        }
        {
          imageUrl &&
            <ViewImage url={imageUrl} close={()=>setImageUrl("")}/>
        }
        {
          openEdit && (
            <EditSubCategory data={editData} close={()=>setOpenEdit(false)} fetchData={fetchSubCategory}/>
          )
        }
        {
          openDelete && (
            <DeleteConf fetchData={fetchSubCategory} close={()=>setOpenDelete(false)} cancel={()=>setOpenDelete(false)} confirm={handleDeleteCat}/>
          )
        }
      
    </section>
  )
}

export default SubCategory
