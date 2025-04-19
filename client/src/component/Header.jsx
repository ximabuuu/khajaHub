import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import Search from './Search'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaUserCircle } from "react-icons/fa";
import useMobile from '../hooks/useMobile';
import { BsCart4 } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import { MdManageAccounts } from "react-icons/md";
import Users from './Users';
import { useGlobalContext } from '../global/globalFunc';
import DisplayCart from './DisplayCart';
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import ReactDOM from 'react-dom'

const Header = () => {
    const [isMobile] = useMobile()
    const location = useLocation()
    const isSearchPage = location.pathname === "/search"
    const navigate = useNavigate()
    const user = useSelector((state) => state?.user)
    const cartItem = useSelector(state => state.cartItem.cart)
    const { totalQty } = useGlobalContext()
    const [userMenu, setUserMenu] = useState(false)
    const [openCart, setOpenCart] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const redirectToLoginPage = () => navigate("/login")
    const handleUserMenu = () => setUserMenu(false)
    const handleMobileUser = () => {
        if (!user._id) return navigate("/login")
        navigate("/user")
    }

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMobileMenuOpen]);


    return (
        <header className='h-32 lg:h-24 lg:shadow-md sticky top-0 overflow-visible z-50 flex flex-col justify-center gap-1 bg-white/80 backdrop-blur-md'>
            {
                !(isSearchPage && isMobile) && (
                    <>
                        <div className='container mx-auto flex items-center px-6 justify-between'>
                            <div className='flex items-center'>
                                <Link to={"/"} className='flex justify-center items-center'>
                                    <img src={logo} alt="Logo" width={95} className='hidden lg:block' />
                                    <img src={logo} alt="Logo" width={65} className='lg:hidden' />
                                </Link>
                                <nav className='hidden md:flex ml-15 space-x-8 text-lg font-semibold'>
                                    <Link className='hover:text-red-800' to={'/'}>Home</Link>
                                    <Link className='hover:text-red-800' to={'/menu'}>Menu</Link>
                                    <Link className='hover:text-red-800' to={'/restaurant'}>Restaurants</Link>
                                    <Link className='hover:text-red-800' to={'/contact'}>Contact</Link>
                                </nav>
                            </div>

                            <div className='hidden lg:block'>
                                <Search />
                            </div>

                            <div className='flex items-center gap-4 lg:gap-10'>
                                {/* Mobile user icon */}
                                <button className='lg:hidden' onClick={handleMobileUser}>
                                    <FaUserCircle size={30} />
                                </button>

                                {/* Mobile menu icon */}
                                <button className='lg:hidden md:hidden' onClick={() => setIsMobileMenuOpen(true)}>
                                    <GiHamburgerMenu size={30} />
                                </button>

                                {/* Desktop user/cart */}
                                <div className='hidden lg:flex items-center gap-6'>
                                    {user?._id ? (
                                        <div className='relative'>
                                            <div onClick={() => setUserMenu(preve => !preve)} className='flex items-center cursor-pointer select-none'>
                                                <MdManageAccounts size={30} />
                                                {userMenu ? <GoTriangleUp size={25} /> : <GoTriangleDown size={25} />}
                                            </div>
                                            {userMenu && ReactDOM.createPortal(
                                                <div
                                                    className="fixed right-6 top-20 z-[1000]"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <div className="bg-white rounded p-4 min-w-52 lg:shadow-lg  overflow-y-auto">
                                                        <Users close={handleUserMenu} />
                                                    </div>
                                                </div>,
                                                document.body
                                            )}

                                        </div>
                                    ) : (
                                        <button onClick={redirectToLoginPage} className='text-lg px-3 hover:text-red-800'>Login</button>
                                    )}
                                    <button onClick={() => setOpenCart(true)} className='flex items-center gap-2 hover:bg-red-100 py-2 px-3 rounded text-black relative'>
                                        <div className='animate-bounce'>
                                            <BsCart4 size={28} />
                                        </div>
                                        {cartItem.length > 0 && (
                                            <div className='absolute top-0 right-0 translate-x-2 -translate-y-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                                                {totalQty}
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Sidebar Menu */}
                        {ReactDOM.createPortal(
                            <div
                                className={`fixed top-0 right-0 h-screen w-64 bg-white shadow-lg z-[9999] lg:hidden md:hidden transform transition-transform duration-300 
                                ${isMobileMenuOpen ? "translate-x-0 pointer-events-auto opacity-100" : "translate-x-full pointer-events-none opacity-0"}`}
                            >
                                <div className="flex justify-between items-center px-4 py-3 border-b">
                                    <h2 className="text-xl font-semibold">Menu</h2>
                                    <button onClick={() => setIsMobileMenuOpen(false)}>
                                        <IoMdClose size={26} />
                                    </button>
                                </div>
                                <nav className="flex flex-col gap-4 p-4 text-lg font-semibold">
                                    <Link to='/' onClick={() => setIsMobileMenuOpen(false)} className='hover:text-red-800'>Home</Link>
                                    <Link to='/menu' onClick={() => setIsMobileMenuOpen(false)} className='hover:text-red-800'>Menu</Link>
                                    <Link to='/restaurant' onClick={() => setIsMobileMenuOpen(false)} className='hover:text-red-800'>Restaurants</Link>
                                    <Link to='/contact' onClick={() => setIsMobileMenuOpen(false)} className='hover:text-red-800'>Contact</Link>
                                </nav>
                            </div>,
                            document.body
                        )}



                        {/* Backdrop when sidebar is open */}
                        {isMobileMenuOpen && ReactDOM.createPortal(
                            <div
                                className="fixed inset-0 bg-black/40 z-[9998]"
                                onClick={() => setIsMobileMenuOpen(false)}
                            />,
                            document.body
                        )}

                    </>
                )
            }

            {/* Mobile search always visible */}
            <div className='container mx-auto px-2 lg:hidden'>
                <Search />
            </div>

            {openCart && (
                <DisplayCart close={() => setOpenCart(false)} />
            )}
        </header>
    )
}

export default Header
