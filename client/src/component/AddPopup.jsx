import React, { useState } from 'react';
import { IoMdCloseCircle } from "react-icons/io";
import uploadImage from '../utils/uploadImage';
import { MdDelete } from 'react-icons/md';
import { FaCloudUploadAlt } from 'react-icons/fa';
import Loading from './Loading';
import SummaryApi from '../config/SummaryApi';
import Axios from '../utils/axios';
import AxiosToastError from '../utils/AxiosToastError';
import { toast } from 'react-hot-toast';

const AddPopup = ({ Close }) => {
    const [data, setData] = useState({ image: [] });
    const [loading, setLoading] = useState(false);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        try {
            const response = await uploadImage(file);
            const { data: ImageResponse } = response;
            const imageUrl = ImageResponse.data.url;

            setData((prev) => ({
                ...prev,
                image: [...prev.image, imageUrl]
            }));
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Failed to upload image");
        } finally {
            setLoading(false);
        }
    };

    const handleDelImg = (index) => {
        setData((prev) => ({
            ...prev,
            image: prev.image.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (data.image.length === 0) {
            toast.error("Please upload at least one image.");
            return;
        }

        try {
            const response = await Axios({
                ...SummaryApi.addPopUp,
                data: { imageUrl: data.image[0] }, // Assuming one popup image
            });

            if (response.data.success) {
                toast.success(response.data.message);
                setData({ image: [] });
                Close(); // Close modal after submission
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    return (
        <section className='fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center'>
            <div className='bg-white p-4 w-[60vh] rounded'>
                <div className='flex items-center justify-between'>
                    <h3 className='font-semibold'>Add PopUp</h3>
                    <button onClick={Close} className='rounded-full'>
                        <IoMdCloseCircle size={20} />
                    </button>
                </div>

                <div className='grid gap-1'>
                    <p className='font-medium'>Image</p>
                    <div>
                        <label htmlFor='Image' className='bg-blue-50 h-24 flex items-center justify-center rounded border border-blue-200 cursor-pointer'>
                            <div className='text-center flex justify-center items-center flex-col'>
                                {loading ? <Loading /> : <>
                                    <FaCloudUploadAlt size={60} />
                                    <p>Upload Image</p>
                                </>}
                            </div>
                            <input type="file"
                                className='hidden'
                                id='Image'
                                accept='image/*'
                                onChange={handleUpload}
                            />
                        </label>
                    </div>

                    {/* Display uploaded images */}
                    <div className="flex gap-4 mt-1">
                        {data.image.map((img, index) => (
                            <div key={index} className="h-20 w-20 bg-blue-50 border relative group">
                                <img src={img} alt={`Uploaded ${index}`} className="w-full h-full object-cover rounded" />
                                <div onClick={() => handleDelImg(index)} className='absolute bottom-0 right-0 p-1 bg-red-500 hover:bg-red-600 text-white cursor-pointer rounded-full hidden group-hover:block'>
                                    <MdDelete />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Submit Button */}
                    <button onClick={handleSubmit} className='w-full mt-3 bg-blue-600 text-white py-2 rounded'>
                        Save Popup
                    </button>
                </div>
            </div>
        </section>
    );
};

export default AddPopup;
