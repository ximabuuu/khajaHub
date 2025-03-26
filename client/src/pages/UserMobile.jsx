import React from 'react'
import Users from '../component/Users'
import { IoIosCloseCircle } from "react-icons/io";

const UserMobile = () => {
  return (
    <section className='bg-white h-full w-full py-2'>
        <button onClick={()=>window.history.back()} className='text-neutral-950 block w-fit ml-auto'>
        <IoIosCloseCircle size={25} />
        </button>
      <div className='container mx-auto px-6 pb-6'>
        <Users/>
      </div>
    </section>
  )
}

export default UserMobile
