import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Axios from '../utils/axios'
import SummaryApi from '../config/SummaryApi'
import { UrlConverter } from '../utils/UrlConverter'
import ProductCard from './ProductCardRestro'
import ProdCardByCate from './ProdCardByCate'

const RestaurantMenu = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [restaurants, setRestaurants] = useState([])
    const [selectedRestaurant, setSelectedRestaurant] = useState(null)
    const [menu, setMenu] = useState([])
    const [loading, setLoading] = useState(false)

    const extractRestaurantId = (paramId) => {
        return paramId?.split('-').pop()
    }

    const fetchRestaurants = async () => {
        try {
            const res = await Axios(SummaryApi.getRestaurant)
            setRestaurants(res.data.data || [])
        } catch (error) {
            console.error("Error fetching restaurants", error)
        }
    }

    useEffect(() => {
        fetchRestaurants()
    }, [])

    const fetchMenu = async (restaurantId) => {
        try {
            setLoading(true)
            const res = await Axios({
                method: 'POST',
                url: SummaryApi.getProductByRestaurant.url,
                data: { restaurantId }
            })
            const restaurant = restaurants.find(r => r._id === restaurantId)
            setSelectedRestaurant(restaurant || null)
            setMenu(res.data.data || [])
        } catch (error) {
            console.error("Error fetching menu", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const restaurantId = extractRestaurantId(id)

        if (restaurants.length === 0) return

        if (restaurantId) {
            fetchMenu(restaurantId)
        }
    }, [id, restaurants])


    const handleRestaurantSelect = (restro) => {
        navigate(`/restaurant/${UrlConverter(restro.name)}-${restro._id}`)
    }

    return (
        <div className="flex">
            {/* Sidebar */}
            <aside className="w-1/4 bg-gray-100 p-4 max-h-[100vh] overflow-y-auto">
                <h2 className="font-bold text-lg mb-4 text-gray-700">Restaurants</h2>
                <div className="flex flex-col gap-2">
                    {restaurants.map(restro => (
                        <div
                            key={restro._id}
                            onClick={() => handleRestaurantSelect(restro)}
                            className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${selectedRestaurant?._id === restro._id
                                ? 'bg-blue-400 text-white font-semibold'
                                : 'hover:bg-blue-100 text-gray-800'
                                }`}
                        >
                            {restro.name}
                        </div>
                    ))}
                </div>
            </aside>

            {/* Right Side */}
            <main className="flex-1 p-4 max-h-[100vh] overflow-auto">
                {id ? (
                    <>
                        <h1 className="text-2xl font-bold mb-6 text-gray-800">
                            {selectedRestaurant?.name || 'Loading...'}
                        </h1>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                {Array(10).fill(0).map((_, index) => (
                                    <ProdCardByCate key={index} />
                                ))}
                            </div>
                        ) : menu.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                {menu.map(item => (
                                    <ProductCard key={item._id} data={item} selectedRestaurant={selectedRestaurant} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center">No items available.</p>
                        )}
                    </>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500 text-lg">
                        Please select a restaurant to view the menu.
                    </div>
                )}
            </main>


        </div>
    )
}

export default RestaurantMenu
