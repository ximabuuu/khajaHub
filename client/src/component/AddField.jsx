import React from 'react'
import { IoMdCloseCircle } from "react-icons/io";

const AddField = ({close,value,onChange,submit}) => {
  return (
    <section className='fixed top-0 right-0 bottom-0 left-0 bg-neutral-900/70 z-50  flex items-center justify-center p-4'>
        <div className='bg-white rounded p-4 w-full max-w-md'>
            <div className='flex items-center justify-between gap-3'>
                <h1 className='font-semibold'>Add Field</h1>
                <button onClick={close}>
                    <IoMdCloseCircle size={25} />
                </button>
            </div>
            <input type="text" value={value} onChange={onChange} className='bg-blue-50 my-3 p-2 border outline-none focus-within:border-red-800 rounded w-full' placeholder='Enter Field Name' />
            <button onClick={submit} className='bg-red-800 px-4 py-2 text-white w-fit rounded hover:bg-red-600 mx-auto flex'>
                Add
            </button>
        </div>
    </section>
  )
}

export default AddField
