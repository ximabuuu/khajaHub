
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Axios from "../utils/axios"
import { ChevronDown, Filter, ShoppingBag, SortAsc, SortDesc } from "lucide-react"

const Menu = () => {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [subcategories, setSubcategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [filters, setFilters] = useState({
        category: "",
        subCategory: "",
        sortBy: "createdAt",
        order: "desc",
    })

    const navigate = useNavigate()

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const query = new URLSearchParams(filters).toString()
            const response = await Axios.get(`/api/product/getmenu?${query}`)
            setProducts(response.data.data)
            setLoading(false)
        } catch (err) {
            console.error("Error fetching menu items", err)
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const res = await Axios.get("/api/category/getCategory")
            if (Array.isArray(res.data.data)) {
                setCategories(res.data.data)
            } else {
                console.error("Invalid category data format:", res.data)
            }
        } catch (err) {
            console.error("Failed to fetch categories", err)
        }
    }

    const fetchSubcategories = async (categoryId = "") => {
        try {
            const res = await Axios.get("/api/subcategory/get", {
                params: { categoryId },
            })
            if (Array.isArray(res.data.data)) {
                setSubcategories(res.data.data)
            } else {
                console.error("Invalid subcategory data format:", res.data)
            }
        } catch (err) {
            console.error("Failed to fetch subcategories", err)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    useEffect(() => {
        if (filters.category) {
            fetchSubcategories(filters.category)
        } else {
            setSubcategories([])
        }
    }, [filters.category])

    useEffect(() => {
        fetchProducts()
    }, [filters])

    const handleAddClick = (productId) => {
        navigate(`/product/${productId}`)
    }

    const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen)
    }

    const getSortIcon = () => {
        return filters.order === "desc" ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />
    }

    const toggleSortOrder = () => {
        setFilters({
            ...filters,
            order: filters.order === "desc" ? "asc" : "desc",
        })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero section */}
            <div className="bg-gradient-to-r from-red-700 to-red-900 text-white py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Explore Our Menu</h1>
                    <p className="text-center text-lg max-w-2xl mx-auto opacity-90">
                        Discover our delicious selection of dishes, carefully prepared with the finest ingredients
                    </p>
                </div>
            </div>

            {/* Filters section */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={toggleFilter}
                        className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-all"
                    >
                        <Filter className="w-5 h-5 text-red-800" />
                        <span className="font-medium">Filters</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isFilterOpen ? "rotate-180" : ""}`} />
                    </button>

                    <div className="flex items-center gap-2">
                        <select
                            value={filters.sortBy}
                            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                            className="border border-gray-200 p-2 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            <option value="createdAt">Newest</option>
                            <option value="price">Price</option>
                            <option value="name">Name</option>
                        </select>

                        <button
                            onClick={toggleSortOrder}
                            className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-all"
                        >
                            {getSortIcon()}
                        </button>
                    </div>
                </div>

                {/* Expandable filter options */}
                <div
                    className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 transition-all duration-300 overflow-hidden ${isFilterOpen ? "max-h-96" : "max-h-0 p-0 border-0 opacity-0"}`}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value, subCategory: "" })}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                                <option value="">All Categories</option>
                                {categories.length > 0 ? (
                                    categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))
                                ) : (
                                    <option>No Categories Available</option>
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                            <select
                                value={filters.subCategory}
                                onChange={(e) => setFilters({ ...filters, subCategory: e.target.value })}
                                className={`w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${!filters.category ? "bg-gray-100 cursor-not-allowed" : ""}`}
                                disabled={!filters.category}
                            >
                                <option value="">All Subcategories</option>
                                {subcategories.length > 0 ? (
                                    subcategories.map((subcat) => (
                                        <option key={subcat._id} value={subcat._id}>
                                            {subcat.name}
                                        </option>
                                    ))
                                ) : (
                                    <option>No Subcategories Available</option>
                                )}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products grid */}
            <div className="max-w-7xl mx-auto px-4 pb-12">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-800"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                        <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700">No products found</h3>
                        <p className="text-gray-500 mt-2">Try changing your filter options</p>
                    </div>
                ) : (
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group"
                            >
                                <div className="relative overflow-hidden">
                                    <Link to={`/product/${product._id}`}>
                                        <img
                                            src={product.image[0] || "https://via.placeholder.com/300x200"}
                                            alt={product.name}
                                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </Link>
                                </div>

                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">{product.name}</h2>
                                    </div>
                                    <div>
                                        <span className="font-bold text-red-800">Rs. {product.price}</span>
                                    </div>
                                    <div className="flex items-center text-xs text-gray-500 mb-3">
                                        <span className="bg-gray-100 px-2 py-1 rounded-full">
                                            {product.category[0]?.name || "Category"}
                                        </span>
                                        {product.subCategory[0]?.name && (
                                            <>
                                                <span className="mx-1">•</span>
                                                <span className="bg-gray-100 px-2 py-1 rounded-full">{product.subCategory[0]?.name}</span>
                                            </>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleAddClick(product._id)}
                                        className="w-full bg-red-800 text-white py-2 rounded-lg hover:bg-red-700 transition-colors duration-300 flex items-center justify-center gap-2 mt-2"
                                    >
                                        <ShoppingBag className="w-4 h-4" />
                                        <span>Add to Cart</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Menu
