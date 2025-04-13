import React, { useState } from 'react'
import AddToCart from './AddToCart'

const RestaurantPopUp = ({ data, onClose }) => {
    const [selectedRestaurant, setSelectedRestaurant] = useState(null)

    const handleSelectRestaurant = (e) => {
        const selected = data.restaurant.find(r => r._id === e.target.value)
        setSelectedRestaurant(selected)
    }

    return (
        <div
            className='fixed inset-0 bg-slate-50/10 flex items-center justify-center z-50'
            onClick={onClose} // click outside to close
        >
            <div
                className='bg-white rounded-lg shadow-md p-5 w-full max-w-sm'
                onClick={(e) => e.stopPropagation()} // prevent bubbling to backdrop
            >
                <h2 className='font-semibold text-lg mb-4'>Select Restaurant</h2>

                <select
                    onChange={handleSelectRestaurant}
                    value={selectedRestaurant?._id || ''}
                    className='w-full border px-3 py-2 rounded mb-4'
                >
                    <option value='' disabled>Select a restaurant</option>
                    {data.restaurant?.map(r => (
                        <option key={r._id} value={r._id}>{r.name}</option>
                    ))}
                </select>

                {/* Display selected restaurant name if one is selected */}
                {selectedRestaurant ? (
                    <div className='mb-4'>
                        <strong>Selected Restaurant:</strong> {selectedRestaurant.name}
                    </div>
                ) : (
                    <div className='mb-4 text-gray-500'>No restaurant selected</div>
                )}

                <div className='flex justify-between gap-2'>
                    <button
                        onClick={onClose}
                        className='bg-gray-300 px-4 py-2 rounded w-1/2'
                    >
                        Cancel
                    </button>

                    {selectedRestaurant ? (
                        <div className='w-1/2'>
                            <AddToCart data={data} selectedRestaurant={selectedRestaurant} />
                        </div>
                    ) : (
                        <button
                            disabled
                            className='bg-gray-400 px-4 py-2 rounded w-1/2 text-white'
                        >
                            Select First
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RestaurantPopUp
