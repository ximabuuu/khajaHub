import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import AddAddress from '../component/AddAddress'
import { MdDelete } from "react-icons/md";
import { MdModeEdit } from "react-icons/md";
import EditAddress from '../component/EditAddress';
import Axios from '../utils/axios';
import SummaryApi from '../config/summaryApi.js';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { useGlobalContext } from '../global/globalFunc';


const Address = ({ close }) => {

  const addressList = useSelector(state => state.addresses.addressList)
  const [openAddress, setOpenAddress] = useState(false)
  const [openEdit,setOpenEdit] = useState(false)
  const [editData,setEditData ] = useState({})
  const {fetchAddress} = useGlobalContext()

  const handleDisableAddress = async (id)=>{
    try {
      const response = await Axios({
        ...SummaryApi.deleteAddress,
        data : {
          _id : id
        }
      })

      if (response.data.success) {
        toast.success("Address Removed")
        if (fetchAddress) {
          fetchAddress()
        }
      }

    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <div>
      <div className='bg-white shadow-lg px-2 py-2 '>
        <h2 className='font-semibold'>Addresses</h2>
      </div>
      <div className='bg-blue-50 p-1 grid gap-4'>
        {
          addressList.map((a, index) => {
            return (
              <div className={`bg-white text-base font-normal border rounded p-3 text-neutral-700 flex gap-2 hover:bg-blue-50 ${!a.status && 'hidden'}`}>
                <div className='w-full'>
                  <p>{a.address_line}</p>
                  <p>{a.city}</p>
                  <p>{a.Province}</p>
                  <p>{a.country} - {a.pincode}</p>
                  <p>{a.mobile}</p>
                </div>
                <div className='grid gap-10'>
                  <button onClick={()=>{
                    setOpenEdit(true)
                    setEditData(a)
                  }} className='p-1 rounded hover:text-green-800 '><MdModeEdit size={22} /></button>
                  <button onClick={()=>{
                    handleDisableAddress(a._id)
                  }} className='p-1 rounded hover:text-red-800 '><MdDelete size={22} /></button>
                </div>
              </div>

            )
          })
        }
        <div onClick={() => setOpenAddress(true)} className='h-24 bg-blue-50 border border-blue-200 border-dashed flex justify-center items-center cursor-pointer'>
          Add Address
        </div>
      </div>
      {
        openAddress && (
          <AddAddress close={() => setOpenAddress(false)} />
        )
      }
      {
        openEdit && (
          <EditAddress data={editData} close={()=>setOpenEdit(false)} />
        )
      }
    </div>
  )
}

export default Address
