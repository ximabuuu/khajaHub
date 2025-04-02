import React, { useState } from 'react'
import AddPopup from '../component/AddPopup'
import SummaryApi from '../config/SummaryApi'
import Axios from '../utils/axios'
import AxiosToastError from '../utils/AxiosToastError'
import { useEffect } from 'react'
import NoData from '../component/NoData'

const PopUp = () => {

    const [popupData, setPopupData] = useState([])
    const [openAdd, setOpenAdd] = useState(false)
    const [loading, setLoading] = useState(false)

    const fetchPopup = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getPopUp
            })
            const { data: responseData } = response
            if (responseData.success) {
                setPopupData(responseData.data)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPopup()
    }, [])

    return (
        <section>
            <div className='flex items-center justify-between bg-blue-100 p-4 rounded shadow-md'>
                <h2 className='font-semibold'>Pop Up</h2>
                <button onClick={() => setOpenAdd(true)} className='bg-red-800 hover:bg-white hover:text-black hover:border-red-800 border px-4 py-1 rounded text-white'>Add</button>
            </div>
            {
                !popupData[0] && !loading && (
                    <NoData />
                )
            }
            <div className='mt-10 flex items-center justify-center'>
                {
                    popupData.map((popup, index) => {
                        return (
                            <div className='w-50 h-55 p-4 bg-blue-50 rounded'>
                                <img className='w-full' src={popup.imageUrl} alt="" />
                                <div className='flex items-center justify-between'>
                                    <button className='bg-green-500 text-white px-2 rounded-2xl mt-1 hover:bg-green-700'>Edit</button>
                                    <button className='bg-red-500 text-white px-2 rounded-2xl mt-1 hover:bg-red-700'>Delete</button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            {
                openAdd && (
                    <AddPopup Close={() => setOpenAdd(false)} />
                )
            }

        </section>
    )
}

export default PopUp