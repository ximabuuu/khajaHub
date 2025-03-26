import React, { useEffect, useState } from 'react'
import AddCategory from '../component/AddCategory'
import Loading from '../component/Loading'
import NoData from '../component/NoData'
import Axios from '../utils/axios'
import SummaryApi from '../config/SummaryApi'
import EditCategory from '../component/EditCategory'
import DeleteConf from '../component/DeleteConf'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { useSelector } from 'react-redux'

const Category = () => {

    const [openUpload,setOpenUpload] = useState(false)
    const [loading,setLoading] = useState(false)
    const [categoryData,setCategoryData] = useState([])
    const [openEdit,setOpenEdit] = useState(false)
    const [editData,setEditData] = useState({
        name : "",
        image : ""
    })

    const [openDelete,setOpenDelete] = useState(false)
    const [deleteCat,setDeleteCat] = useState({
        _id : ""
    })

    // const allCategory = useSelector(state => state.product.allCategory)

    // useEffect(()=>{
    //     setCategoryData(allCategory)
    // },[allCategory ])

    const fetchCategory = async()=>{
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getCategory
            })
            const {data : responseData} = response
            if (responseData.success) {
                setCategoryData(responseData.data)
            }
        } catch (error) {
            
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchCategory()
    },[])

    const handleDeleteCat = async ()=>{
        try {
            const response = await Axios({
                ...SummaryApi.deleteCategory,
                data : deleteCat
            })

            const { data : responseData} = response

            if (responseData.success) {
                toast.success(responseData.message)
                // fetchCategory()
                setOpenDelete(false)
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

  return (
    <section>
        <div className='p-2 bg-white shadow-md flex items-center justify-between'>
            <h2 className='font-semibold'>Category</h2>
            <button onClick={()=>setOpenUpload(true)} className='text-sm border border-red-800 hover:bg-red-800 rounded px-3 py-1 hover:text-white'>Add Category</button>
        </div>
        {
            !categoryData[0] && !loading && (
                
                <NoData/>
            )
        }
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 lg:p-4'>
            {
                categoryData.map((category,index)=>{
                    return(
                        <div className='w-38 h-52 lg:w-42 lg:h-56 rounded bg-blue-50 shadow-md p-4 flex flex-col items-center gap-2' key={category._id}>
                            <img src={category.image} alt="" className='w-52 object-scale-down rounded-md' />
                            <h3 className='font-semibold '>{category.name}</h3>
                            <div className='flex gap-4 lg:gap-10 '>
                                <button onClick={()=>{
                                    setOpenEdit(true)
                                    setEditData(category)
                                }} className='bg-green-300 lg:px-2 px-1 text-[15px] rounded-2xl cursor-pointer hover:bg-green-500'>Edit</button>
                                <button onClick={()=>{
                                    setOpenDelete(true)
                                    setDeleteCat(category)
                                }} className='bg-red-300 lg:px-2 px-1 text-[15px] rounded-2xl cursor-pointer hover:bg-red-500'>Delete</button>
                            </div>
                        </div>
                    )
                })
            }
        </div>
        {
            loading && (
                <Loading/>
            )
        }
        
        {
            openUpload && (
                <AddCategory fetchData={fetchCategory} close={()=>setOpenUpload(false)}/>
            )
        }

        {
            openEdit && (
                <EditCategory data={editData} close={()=>setOpenEdit(false)} fetchData={fetchCategory}/>
            )
        }

        {
            openDelete && (
                <DeleteConf close={()=>setOpenDelete(false)} cancel={()=>setOpenDelete(false)} confirm={handleDeleteCat}/>
            )
        }
        
    </section>
  )
}

export default Category
