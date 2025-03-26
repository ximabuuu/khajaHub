import React from 'react'
import { useSelector } from 'react-redux'
import Admin from '../utils/Admin'

const AdminPerm = ({children}) => {

    const user = useSelector(state => state.user)



  return (
    <>
        {
            Admin(user.role) ? children : <p className='text-red-800 bg-red-100 p-4'>You do not have any permission</p>
        }
    </>
  )
}

export default AdminPerm
