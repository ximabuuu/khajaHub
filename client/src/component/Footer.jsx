import React from 'react'
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className='border-t bg-white'>
        <div className='container mx-auto p-6 text-center flex flex-col lg:flex-row lg:justify-between gap-2'>
            <p>© All Rights Reserved 2025.</p>
            <div className='flex items-center gap-4 justify-center text-2xl'>
            <a href="" className='hover:text-blue-500'><FaFacebook /></a>
            <a href="" className='hover:text-red-500'><FaInstagram /></a>
            <a href="" className='hover:text-black-100'><FaSquareXTwitter /></a>
        </div>
        </div>
    </footer>
  )
}

export default Footer
