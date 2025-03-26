import React, { useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import Axios from '../utils/axios'
import SummaryApi from '../config/summaryApi.js'
import AxiosToastError from '../utils/AxiosToastError'
import { updatedAvatar } from '../redux/userSlice'
import { IoIosCloseCircle } from "react-icons/io";

const ProfileEdit = ({close}) => {

    const user = useSelector(state=>state.user)
    const dispatch = useDispatch()
    const [loading,setLoading] = useState(false)
    const handleSubmit = (e)=>{
        e.preventDefault()
    }

    const handleUploadAvatar = async (e)=>{
        const file = e.target.files[0]
        
        if(!file){
            return
        }

        const formData = new FormData()
        formData.append('avatar',file)

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.uploadAvatar,
                data : formData
            })
            const {data : responseData} = response 

            dispatch(updatedAvatar(responseData.data.avatar))
        } catch (error) {
            AxiosToastError(error)
        } finally{
            setLoading(false)
        }


    }

  return (
    <section className='fixed top-0 bottom-0 left-0 right-0 bg-neutral-900/60 p-4 flex items-center justify-center '>
        <div className='bg-white max-w-sm w-full rounded p-4 flex flex-col items-center justify-center'>
            <button onClick={close} className='text-neutral-950 block w-fit ml-auto'>
                <IoIosCloseCircle size={25} />
            </button>
            <div className='w-22 h-22 bg-red-800 flex items-center justify-center rounded-full overflow-hidden'>
                {
                    user.avatar ? (
                        <img className='w-full h-full' src={user.avatar} alt={user.name} />
                    ) : (
                        <FaUserCircle size={80} />
                    )
                }
            </div>
            <form onSubmit={handleSubmit}>
                <label htmlFor='uploadProfile'>
                    <div className='border border-red-800 hover:bg-red-800 hover:text-white rounded-full px-4 text-sm py-1 my-3'>
                        {
                            loading ? "ekxin pakh..." : "Upload"
                        }
                        
                        </div>
                </label>
                <input onChange={handleUploadAvatar} type='file' accept='image/png, image/jpg, image/jpeg' className='hidden' id='uploadProfile' />
            </form>
            
        </div>
    </section>
  )
}

export default ProfileEdit
