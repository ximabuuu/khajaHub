import React from 'react'
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import logo from '../assets/logo.png'

const Footer = () => {
  return (
    <footer className="bg-white py-10 shadow-[0px_-2px_8px_0px_rgba(0,_0,_0,_0.8)]">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="flex flex-col items-center">
          <div className='flex items-center'>
            <img src={logo} alt="khaja" width={50} />
            <h2 className="text-2xl font-bold">Khaja</h2>
          </div>
          <p className="mt-2 text-gray-900">Satisfy Your Cravings, Anytime, Anywhere!</p>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-semibold">Quick Links</h3>
          <ul className="mt-2 space-y-2">
            <li><a href="aboutus" className="text-gray-900 hover:text-gray-500">About Khaja</a></li>
            <li><a href="contact" className="text-gray-900 hover:text-gray-500">Contact</a></li>
            <li><a href="privacypolicy" className="text-gray-900 hover:text-gray-500">Privacy Policy</a></li>
          </ul>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-semibold">Follow Us</h3>
          <div className="flex mt-3 space-x-4">
            <a href="#" className="text-gray-900 hover:text-blue-500 text-2xl">
              <FaFacebook />
            </a>
            <a href="#" className="text-gray-900 hover:text-red-500 text-2xl">
              <FaInstagram />
            </a>
            <a href="#" className="text-gray-900 hover:text-black text-2xl">
              <FaSquareXTwitter />
            </a>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-700 mt-8 border-t border-gray-700 pt-4">
        &copy; 2025 Khaja. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
