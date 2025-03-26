import React from 'react'
import { useForm } from "react-hook-form"
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/axios'
import SummaryApi from '../config/SummaryApi.js'
import toast from 'react-hot-toast'
import { IoMdCloseCircle } from "react-icons/io";
import { useGlobalContext } from '../global/globalFunc'

const AddAddress = ({ close }) => {

    const { register, handleSubmit, reset } = useForm()
    const { fetchAddress } = useGlobalContext()

    const onSubmit = async (data) => {
        console.log("data", data)

        try {
            const response = await Axios({
                ...SummaryApi.addAddress,
                data: {
                    address_line: data.addressline,
                    city: data.city,
                    country: data.country,
                    Province: data.Province,
                    pincode: "56705",
                    mobile: data.mobile
                }
            })

            const { data: responseData } = response
            if (responseData.success) {
                toast.success(responseData.message)
                if (close) {
                    close()
                    reset()
                    fetchAddress()
                }
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='bg-gray-900/70 fixed top-0 right-0 left-0 bottom-0 z-50 h-[100vh] overflow-auto'>
            <div className='bg-white p-4 w-full max-w-lg mt-10 mx-auto rounded'>
                <div className='flex items-center justify-between'>
                    <h2 className=' font-semibold'>Add Address</h2>
                    <button onClick={close} className='hover:text-red-800'><IoMdCloseCircle size={25} /></button>
                </div>
                <form className='mt-4 grid gap-4' onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid gap-1'>
                        <label htmlFor="country">Country : </label>
                        <input type="text" id='country' className='border bg-blue-50 p-2 rounded' value='Nepal' readOnly
                            {
                            ...register("country", { required: true })
                            }
                        />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor="Province">Province : </label>
                        <input type="text" id='Province' className='border bg-blue-50 p-2 rounded' value='Koshi Pradesh' readOnly
                            {
                            ...register("Province", { required: true })
                            }
                        />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor="city">City : </label>
                        <input type="text" id='city' className='border bg-blue-50 p-2 rounded' value='Itahari' readOnly
                            {
                            ...register("city", { required: true })
                            }
                        />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor="addressline">Address Line : </label>
                        <input type="text" id='addressline' className='border bg-blue-50 p-2 rounded'
                            {
                            ...register("addressline", { required: true })
                            }
                        />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor="mobile">Mobile No. : </label>
                        <input type="text" id='mobile' className='border bg-blue-50 p-2 rounded'
                            {
                            ...register("mobile", { required: true })
                            }
                        />
                    </div>
                    <button type='submit' className='bg-red-800 w-full text-white font-semibold py-2 mt-4 hover:bg-red-600 rounded'>Submit</button>
                </form>
            </div>
        </section>
    )
}

export default AddAddress
