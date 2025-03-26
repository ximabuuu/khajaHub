import React from 'react'
import { useState } from 'react';
import { IoMdCloseCircle } from "react-icons/io";
import Axios from '../utils/axios';
import SummaryApi from '../config/SummaryApi.js';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';

const EditRestro = ({fetchData,close,data :restroData}) => {

    const [data,setData] = useState({
            _id : restroData._id,
            name : restroData.name
        })
    
        const [loading,setLoading] = useState(false)

        const handleOnChange = (e)=>{
            const {name, value} = e.target
    
            setData((preve)=>{
                return{
                    ...preve,
                    [name] : value
                }
            })
        }
    
    
        const handleSubmit = async (e)=>{
            e.preventDefault()
    
            try {
                setLoading(true)
                const response = await Axios({
                    ...SummaryApi.updateRestaurant,
                    data : data
                })
                const { data : responseData } = response
    
                if (responseData.success) {
                    toast.success(responseData.message)
                    close()
                    fetchData()
                }
    
            } catch (error) {
                AxiosToastError(error)
            }finally{
                setLoading(false)
            }
        }

  return (
    <section className='fixed top-0 bottom-0 right-0 left-0 p-4 bg-gray-600/60 flex items-center justify-center'>
        <div className='bg-white max-w-4xl w-full p-4 rounded'>
            <div className='flex items-center justify-between'>
                <h1 className='font-semibold'>Update Restaurant</h1>
                <button onClick={close} className='w-fit ml-auto block'><IoMdCloseCircle size={25} /></button>
            </div>
            <form className='grid gap-2' onSubmit={handleSubmit}>
                <div className='grid gap-1'>
                    <label id='restaurant'>Name</label>
                    <input className='bg-blue-50 border border-blue-100 focus-within:border-black outline-none p-2 rounded' type="text" name='name' value={data.name} onChange={handleOnChange} placeholder='Enter Restaurant Name' />
                </div>
                <button type='submit' className={
                `
                ${data.name ? "bg-red-800 text-white hover:bg-red-600" : "bg-gray-400"}
                py-2 font-semibold
                `
            }>Update</button>
            </form>
        </div>
    </section>
  )
}

export default EditRestro
