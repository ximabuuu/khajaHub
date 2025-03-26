import React from 'react'
import Users from '../component/Users'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Dashboard = () => {

  const user = useSelector(state => state.user)

  console.log(user)

  return (
    <section className='bg-white'>
        <div className='container mx-auto p-3 grid lg:grid-cols-[250px_minmax(900px,_1fr)_15px] overflow-y-auto'>
                {/**left */}
                <div className='py-4  max-h-[calc(100vh-96px)] overflow-y-auto hidden lg:block border-r'>
                    <Users/>
                </div>

                {/**right */}
                <div className='bg-white p-4 min-h-[75vh]'>
                    <Outlet/>
                </div>
        </div>
    </section>
  )
}

export default Dashboard
