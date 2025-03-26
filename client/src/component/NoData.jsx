import React from 'react'
import nodata from '../assets/nodata.png'

const NoData = () => {
  return (
    <div className='flex flex-col items-center justify-center p-4'>
      <img src={nodata} alt="" className='w-36' />
      <p>No Data Available</p>
    </div>
  )
}

export default NoData
