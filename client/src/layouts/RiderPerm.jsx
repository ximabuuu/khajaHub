import React from 'react'
import { useSelector } from 'react-redux'
import Rider from '../utils/Rider'

const RiderPerm = ({children}) => {

    const user = useSelector(state => state.user)



  return (
    <>
        {
            Rider(user.role) ? children : <p className='text-red-800 bg-red-100 p-4'>You are not rider.</p>
        }
    </>
  )
}

export default RiderPerm
