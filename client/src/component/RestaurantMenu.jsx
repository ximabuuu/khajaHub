import '../App.css'
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Search, MapPin, MenuIcon, X, Clock, Star, ShoppingBag } from "lucide-react"
import Axios from "../utils/axios"
import SummaryApi from "../config/SummaryApi"
import { UrlConverter } from "../utils/UrlConverter"
import AddToCart from "./AddToCart"

const RestaurantMenu = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [restaurants, setRestaurants] = useState([])
    const [selectedRestaurant, setSelectedRestaurant] = useState(null)
    const [menu, setMenu] = useState([])
    const [loading, setLoading] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [restaurantSearchQuery, setRestaurantSearchQuery] = useState("")
    const [menuSearchQuery, setMenuSearchQuery] = useState("")
    const [activeCategory, setActiveCategory] = useState("all")

    // Extract categories from menu items
    const categories =
        menu.length > 0 ? ["all", ...new Set(menu.map((item) => item.category?.[0]?.name).filter(Boolean))] : ["all"]

    // Filter menu items by search query and category
    const filteredMenu = menu.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(menuSearchQuery.toLowerCase())
        const matchesCategory = activeCategory === "all" || item.category?.[0]?.name === activeCategory
        return matchesSearch && matchesCategory
    })

    const extractRestaurantId = (paramId) => {
        return paramId?.split("-").pop()
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
                method: "POST",
                url: SummaryApi.getProductByRestaurant.url,
                data: { restaurantId },
            })
            const restaurant = restaurants.find((r) => r._id === restaurantId)
            setSelectedRestaurant(restaurant || null)
            setMenu(res.data.data || [])
            setActiveCategory("all")
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
        setSidebarOpen(false)
    }

    const handleAddClick = (productId) => {
        navigate(`/product/${productId}`)
    }

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    return (
        <div className="min-h-screen max-h-[100vh] overflow-auto bg-gray-50">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white shadow-sm py-4 px-4 sticky top-0 z-30">
                <div className="flex items-center justify-between">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {sidebarOpen ? <X size={24} /> : <MenuIcon size={24} />}
                    </button>
                    <h1 className="text-lg font-semibold truncate max-w-[200px]">
                        {selectedRestaurant?.name || "Select Restaurant"}
                    </h1>
                    <div className="w-10"></div> {/* Spacer for alignment */}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row">
                {/* Sidebar - Desktop (permanent) and Mobile (overlay) */}
                <aside
                    className={`${sidebarOpen ? "fixed inset-0 z-40 block" : "hidden"
                        } lg:relative lg:block lg:w-1/4 xl:w-1/5 bg-white shadow-md lg:shadow-none transition-all duration-300 ease-in-out`}
                >
                    <div className="h-full max-h-screen overflow-y-auto">
                        {/* Overlay background for mobile */}
                        <div
                            className={`${sidebarOpen ? "fixed inset-0 bg-black/50 z-30" : "hidden"} lg:hidden`}
                            onClick={toggleSidebar}
                        ></div>

                        {/* Sidebar content */}
                        <div className="relative z-40 bg-white h-full w-3/4 max-w-xs lg:w-full lg:max-w-none">
                            <div className="p-4 border-b sticky top-0 bg-white z-10">
                                <h2 className="font-bold text-xl text-gray-800 mb-4">Restaurants</h2>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="text"
                                        placeholder="Search restaurants..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
                                        onChange={(e) => setRestaurantSearchQuery(e.target.value)}
                                        value={restaurantSearchQuery}
                                    />
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="flex flex-col gap-2">
                                    {restaurants
                                        .filter((r) => r.name.toLowerCase().includes(restaurantSearchQuery.toLowerCase()))
                                        .map((restro) => (
                                            <div
                                                key={restro._id}
                                                onClick={() => handleRestaurantSelect(restro)}
                                                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${selectedRestaurant?._id === restro._id
                                                    ? "bg-red-800 text-white shadow-md"
                                                    : "hover:bg-orange-50 text-gray-800"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-gray-100 rounded-full p-2 flex-shrink-0">
                                                        <MapPin
                                                            size={16}
                                                            className={selectedRestaurant?._id === restro._id ? "text-black" : "text-gray-500"}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{restro.name}</div>
                                                        {restro.cuisine && <div className="text-xs opacity-80">{restro.cuisine}</div>}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-h-screen">
                    {id ? (
                        <div className="p-4 lg:p-6">
                            {/* Restaurant Header */}
                            {selectedRestaurant && (
                                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                                        <div className="bg-orange-50 rounded-xl p-4 flex items-center justify-center flex-shrink-0">
                                            <MapPin size={32} className="text-red-800" />
                                        </div>
                                        <div className="flex-1">
                                            <h1 className="text-2xl font-bold text-gray-800 mb-1">{selectedRestaurant.name}</h1>
                                            {selectedRestaurant.cuisine && <p className="text-gray-500 mb-2">{selectedRestaurant.cuisine}</p>}
                                            <div className="flex flex-wrap gap-4 text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                                    <span>4.2</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4 text-gray-400" />
                                                    <span>30-45 min</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Category Filter */}
                            {menu.length > 0 && (
                                <div className="mb-6 overflow-x-auto scrollbar-hide">
                                    <div className="flex gap-2 pb-2">
                                        {categories.map((category) => (
                                            <button
                                                key={category}
                                                onClick={() => setActiveCategory(category)}
                                                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${activeCategory === category
                                                    ? "bg-red-800 text-white"
                                                    : "bg-white text-gray-700 hover:bg-orange-50"
                                                    }`}
                                            >
                                                {category === "all" ? "All Items" : category}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Search Bar */}
                            <div className="relative mb-6">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Search menu items..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 bg-white"
                                    onChange={(e) => setMenuSearchQuery(e.target.value)}
                                    value={menuSearchQuery}
                                />
                            </div>

                            {/* Menu Items */}
                            {loading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {Array(8)
                                        .fill(0)
                                        .map((_, index) => (
                                            <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                                                <div className="h-48 bg-gray-200"></div>
                                                <div className="p-4">
                                                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ) : filteredMenu.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredMenu.map((item) => (
                                        <div
                                            key={item._id}
                                            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                                        >
                                            <div className="relative h-48 overflow-hidden">
                                                <img
                                                    src={item.image?.[0] || "https://via.placeholder.com/300x200?text=Food+Item"}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                                />
                                                {item.discount > 0 && (
                                                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                        {item.discount}% OFF
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-semibold text-lg mb-1 text-gray-800">{item.name}</h3>
                                                <div className="flex items-center gap-1 mb-2">
                                                    <div className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                                                        {item.category[0].name}
                                                    </div>
                                                    {item.subCategory?.[0]?.name && (
                                                        <div className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                                            {item.subCategory[0].name}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex justify-between items-center mt-3">
                                                    <div className="font-bold text-lg">
                                                        Rs. {item.price}
                                                        {item.discount > 0 && (
                                                            <span className="text-sm text-gray-500 line-through ml-2">
                                                                Rs. {Math.round(item.price * (1 + item.discount / 100))}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <AddToCart productId={item._id} selectedRestaurant={selectedRestaurant} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="bg-orange-50 p-4 rounded-full mb-4">
                                            <Search className="h-8 w-8 text-red-800" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No items found</h3>
                                        <p className="text-gray-500 max-w-md">
                                            {menuSearchQuery
                                                ? `We couldn't find any items matching "${menuSearchQuery}"`
                                                : "This restaurant doesn't have any items available right now."}
                                        </p>
                                        {menuSearchQuery && (
                                            <button onClick={() => setMenuSearchQuery("")} className="mt-4 text-red-800 hover:text-red-600">
                                                Clear search
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center p-8 text-center">
                            <div className="max-w-md">
                                <div className="bg-orange-50 p-4 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-4">
                                    <MapPin className="h-8 w-8 text-red-800" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Select a Restaurant</h2>
                                <p className="text-gray-500 mb-6">
                                    Choose a restaurant from the list to view their menu and place your order.
                                </p>
                                <button
                                    onClick={toggleSidebar}
                                    className="bg-red-800 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors lg:hidden"
                                >
                                    Browse Restaurants
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default RestaurantMenu
