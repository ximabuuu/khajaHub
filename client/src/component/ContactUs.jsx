import React, { useState } from 'react';
import Axios from '../utils/axios';
import SummaryApi from '../config/SummaryApi';
import { Helmet } from 'react-helmet';

const ContactUs = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await Axios({
                ...SummaryApi.contact, // This will spread the configuration object from SummaryApi.contact
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: formData, // Make sure you're sending 'data' in the request body, not 'body'
            });
            const result = response.data; // Axios automatically parses the response data
            if (result.success) {
                setStatus('Message sent successfully!');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('Failed to send message. Please try again later.');
            }
        } catch (error) {
            setStatus('An error occurred. Please try again.');
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen py-10 px-6 md:px-16">
            <Helmet>
                <title>ContactUs</title>
            </Helmet>
            <div className="container mx-auto text-center md:text-left max-w-4xl">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Contact Us</h1>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    Have a question or need assistance? Our team is here to help! Reach out to us through the options below.
                </p>

                <div className="bg-white p-6 shadow-lg rounded-lg">
                    <h2 className="text-2xl font-semibold text-gray-900">Get in Touch</h2>
                    <p className="text-lg text-gray-700 mt-2">Feel free to contact us via email, phone, or visit us at our office.</p>

                    <div className="mt-4">
                        <p className="text-lg text-gray-800"><strong>Email:</strong> khajakhau69@gmail.com</p>
                        <p className="text-lg text-gray-800"><strong>Phone:</strong> +977 9765379732</p>
                        <p className="text-lg text-gray-800"><strong>Address:</strong> Itahari, Nepal</p>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-3xl font-semibold text-gray-900">Send Us a Message</h2>
                    <form className="bg-white p-6 shadow-lg rounded-lg mt-4" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-lg font-semibold">Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg mt-1" placeholder="Your Name" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-lg font-semibold">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg mt-1" placeholder="Your Email" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-lg font-semibold">Message</label>
                            <textarea name="message" value={formData.message} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg mt-1" placeholder="Your Message" rows="4" required></textarea>
                        </div>
                        <button type="submit" className="bg-red-500 text-white px-6 py-2 rounded-lg text-lg hover:bg-red-600">Send Message</button>
                    </form>
                    {status && <p className="mt-4 text-lg text-green-600">{status}</p>}
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
