import React from 'react'
import { FaWindowClose } from "react-icons/fa";
import { TiTick } from "react-icons/ti";

const DeleteConf = ({cancel,confirm,close}) => {
  return (
    <div className='fixed top-0 bottom-0 right-0 left-0 z-50 bg-neutral-800/60 p-4 flex justify-center items-center'>
        <div className='bg-white w-full max-w-md p-4 rounded'>
            <div className='flex justify-between items-center gap-3'>
                <h1 className='font-semibold '>Delete Permanently</h1>
                <button onClick={close} className='cursor-pointer'>
                    <FaWindowClose size={25} />
                </button>
            </div>
            <p className='my-4'>Are you sure you want to delete this?</p>
            <div className='w-fit ml-auto gap-3 flex items-center'>
                <button onClick={close} className='px-3 py-1 border rounded border-red-800 text-red-600 hover:bg-red-600 hover:text-white'>
                    Cancel
                </button>
                <button onClick={confirm} className='px-3 py-1 border rounded border-green-800 text-green-600 hover:bg-green-600 hover:text-white'>
                    Confirm
                </button>
            </div>
        </div>
    </div>
  )
}

export default DeleteConf
