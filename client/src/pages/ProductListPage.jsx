
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { ChevronRight, Filter, Grid, List, Search, X } from "lucide-react"
import '../App.css'
import Axios from "../utils/axios"
import SummaryApi from "../config/SummaryApi.js"
import AxiosToastError from "../utils/AxiosToastError"
import ProductCard from "../component/ProductCard"
import { UrlConverter } from "../utils/UrlConverter"

const ProductListPage = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [viewMode, setViewMode] = useState("grid") // grid or list
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  const allSubCategory = useSelector((state) => state.product.allSubCategory)
  const [displaySubCate, setDisplaySubCate] = useState([])

  const params = useParams()
  const subCategoryLen = params?.subCategory?.split("-")
  const subCategoryName = subCategoryLen?.slice(0, subCategoryLen?.length - 1)?.join(" ")
  const categoryId = params?.category.split("-").slice(-1)[0] || ""
  const subCategoryId = params?.subCategory.split("-").slice(-1)[0] || ""

  // Get category name from URL
  const categoryName = params?.category?.split("-").slice(0, -1).join(" ") || ""

  const fetchProductData = async () => {
    if (!categoryId || categoryId.length !== 24 || !subCategoryId || subCategoryId.length !== 24) {
      console.error("Invalid categoryId or subCategoryId format")
      return
    }
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductByCategorySubcategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 12,
        },
      })

      const { data: responseData } = response

      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data)
        } else {
          setData([...data, ...responseData.data])
        }
        setTotalCount(responseData.totalCount)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductData()
  }, [params, page])

  useEffect(() => {
    const sub = allSubCategory.filter((subc) => {
      const filterData = subc.category.some((el) => {
        return el._id === categoryId
      })
      return filterData ? filterData : null
    })
    setDisplaySubCate(sub)
  }, [params, allSubCategory])

  // Filter products based on search query
  const filteredProducts = data.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "popular":
        return b.averageRating - a.averageRating
      case "newest":
      default:
        return new Date(b.createdAt) - new Date(a.createdAt)
    }
  })

  // Load more products
  const loadMore = () => {
    if (data.length < totalCount && !loading) {
      setPage(page + 1)
    }
  }

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="bg-gray-50 min-h-screen max-h-[100vh] overflow-auto">
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:text-red-800">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link to="#" className="hover:text-red-800">
              {categoryName || "Category"}
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-gray-900 font-medium">{subCategoryName || "Subcategory"}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Filter Button */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-gray-900">{subCategoryName || "Products"}</h1>
            <button
              onClick={toggleSidebar}
              className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 flex items-center gap-2"
            >
              <Filter className="h-5 w-5 text-gray-600" />
              <span>Filters</span>
            </button>
          </div>

          {/* Sidebar - Desktop (permanent) and Mobile (overlay) */}
          <aside
            className={`${sidebarOpen ? "fixed inset-0 z-40 block" : "hidden"
              } lg:relative lg:block lg:w-1/4 xl:w-1/5 transition-all duration-300 ease-in-out`}
          >
            {/* Overlay background for mobile */}
            <div
              className={`${sidebarOpen ? "fixed inset-0 bg-black/50 z-30" : "hidden"} lg:hidden`}
              onClick={toggleSidebar}
            ></div>

            {/* Sidebar content */}
            <div className="relative z-40 bg-white h-full w-3/4 max-w-xs lg:w-full lg:max-w-none lg:rounded-xl lg:shadow-sm p-4">
              <div className="flex items-center justify-between mb-6 lg:mb-4">
                <h2 className="font-bold text-lg text-gray-900">Subcategories</h2>
                <button onClick={toggleSidebar} className="lg:hidden p-1">
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide">
                {displaySubCate.length > 0 ? (
                  displaySubCate.map((scate, index) => {
                    const link = `/${UrlConverter(scate?.category[0]?.name)}-${scate?.category[0]?._id}/${UrlConverter(
                      scate.name,
                    )}-${scate._id}`
                    return (
                      <Link
                        to={link}
                        key={scate._id + index + "prod"}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${subCategoryId === scate._id
                          ? "bg-orange-100 text-orange-800 font-medium shadow-sm"
                          : "bg-white hover:bg-gray-50 text-gray-700"
                          }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <div className="w-10 h-10 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          <img
                            src={scate.image || "https://via.placeholder.com/40"}
                            alt={scate.name}
                            className="w-8 h-8 object-contain"
                          />
                        </div>
                        <span className="text-sm">{scate.name}</span>
                      </Link>
                    )
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">No subcategories available</div>
                )}
              </div>

              {/* Price Range Filter (Example) */}
              {/* <div className="mt-8 border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="price-1" className="rounded text-red-800 focus:ring-red-800" />
                    <label htmlFor="price-1" className="ml-2 text-sm text-gray-700">
                      Under ₹500
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="price-2" className="rounded text-red-800 focus:ring-red-800" />
                    <label htmlFor="price-2" className="ml-2 text-sm text-gray-700">
                      ₹500 - ₹1000
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="price-3" className="rounded text-red-800 focus:ring-red-800" />
                    <label htmlFor="price-3" className="ml-2 text-sm text-gray-700">
                      ₹1000 - ₹2000
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="price-4" className="rounded text-red-800 focus:ring-red-800" />
                    <label htmlFor="price-4" className="ml-2 text-sm text-gray-700">
                      Over ₹2000
                    </label>
                  </div>
                </div>
              </div> */}
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:flex-1">
            {/* Header with title and controls */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 hidden lg:block">{subCategoryName || "Products"}</h1>
                  <p className="text-sm text-gray-500">
                    Showing {filteredProducts.length} of {totalCount} products
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="pl-10 pr-4 py-2 w-full sm:w-auto border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-800"
                    >
                      <option value="newest">Newest</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="popular">Most Popular</option>
                    </select>

                    {/* View Mode Toggle */}
                    <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 ${viewMode === "grid" ? "bg-red-800 text-white" : "bg-white text-gray-700"}`}
                      >
                        <Grid className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 ${viewMode === "list" ? "bg-red-800 text-white" : "bg-white text-gray-700"}`}
                      >
                        <List className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading && page === 1 ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-800"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
                      : "space-y-4"
                  }
                >
                  {sortedProducts.map((prod, index) => (
                    <div
                      key={prod._id + index + "prod"}
                      className={viewMode === "list" ? "bg-white rounded-xl shadow-sm " : ""}
                    >
                      <ProductCard data={prod} />
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                {data.length < totalCount && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="px-6 py-3 bg-red-800 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                    >
                      {loading ? "Loading..." : "Load More Products"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-orange-50 p-4 rounded-full mb-4">
                    <Search className="h-8 w-8 text-red-800" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                  <p className="text-gray-500 max-w-md">
                    {searchQuery
                      ? `We couldn't find any products matching "${searchQuery}"`
                      : "There are no products available in this category at the moment."}
                  </p>
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="mt-4 text-red-800 hover:text-orange-600">
                      Clear search
                    </button>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default ProductListPage
