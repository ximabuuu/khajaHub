import React, { useState } from 'react'
import Axios from '../utils/axios'
import SummaryApi from '../config/SummaryApi'
import { Helmet } from 'react-helmet'
import { FaPhoneAlt } from "react-icons/fa"
import { IoMail } from "react-icons/io5"
import { IoLocation } from "react-icons/io5"
import { motion } from 'framer-motion'
import { FaMessage } from "react-icons/fa6";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        inquiryType: 'support',
        message: '',
    });

    const [formStatus, setFormStatus] = useState('idle'); // idle, submitting, success, error

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormStatus('submitting'); // Start submitting

        try {
            // Send to API endpoint
            const response = await Axios.request({
                ...SummaryApi.contact,
                data: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    phone: formData.phone || 'Not provided',
                    inquiryType: formData.inquiryType,
                    message: formData.message,
                }
            });

            if (!response.data.success) {
                throw new Error('Failed to send message');
            }

            setFormStatus('success'); // Message sent successfully

            // Reset form after successful submission
            setTimeout(() => {
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    inquiryType: 'support',
                    message: '',
                });
                setFormStatus('idle');
            }, 3000);

        } catch (error) {
            setFormStatus('error'); // Something went wrong
            console.error('Error:', error);

            // Reset form status after error
            setTimeout(() => {
                setFormStatus('idle');
            }, 3000);
        }
    };


    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
            },
        },
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-orange-50 to-amber-50 py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">Contact Us</h1>
                        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                            We'd love to hear from you. Get in touch with our team for any questions, feedback, or support.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Information */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid gap-8 md:grid-cols-3"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col items-center rounded-xl bg-white p-8 text-center shadow-sm"
                        >
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-red-700">
                                <FaPhoneAlt size={25} />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Phone</h3>
                            <p className="mb-4 text-gray-500">Our friendly team is here to help.</p>
                            <a href="tel:+1234567890" className="font-medium text-red-700 hover:text-orange-600">
                                +977 9841123463
                            </a>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col items-center rounded-xl bg-white p-8 text-center shadow-sm"
                        >
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-red-700">
                                <IoMail size={25} />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Email</h3>
                            <p className="mb-4 text-gray-500">Drop us a line anytime.</p>
                            <a href="mailto:hello@fooddelivery.com" className="font-medium text-red-700 hover:text-orange-600">
                                khajakhau69@gmail.com
                            </a>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col items-center rounded-xl bg-white p-8 text-center shadow-sm"
                        >
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-red-700">
                                <IoLocation size={25} />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Office</h3>
                            <p className="mb-4 text-gray-500">Come say hello at our headquarters.</p>
                            <address className="not-italic text-red-700">Kheti Khola, Itahari</address>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Contact Form and Map */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid gap-8 md:grid-cols-2">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <div className="rounded-xl bg-white p-10 shadow-lg">
                                <h2 className="mb-8 text-4xl font-extrabold text-center text-black">Send Us a Message</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div className="space-y-3">
                                            <label htmlFor="first-name" className="text-lg font-medium text-black">First Name</label>
                                            <input
                                                id="first-name"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                placeholder="John"
                                                required
                                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label htmlFor="last-name" className="text-lg font-medium text-black">Last Name</label>
                                            <input
                                                id="last-name"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                placeholder="Doe"
                                                required
                                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label htmlFor="email" className="text-lg font-medium text-black">Email</label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john.doe@example.com"
                                            required
                                            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label htmlFor="phone" className="text-lg font-medium text-black">Phone (optional)</label>
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+1 (234) 567-890"
                                            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-lg font-medium text-black">What can we help you with?</label>
                                        <div className="flex flex-col space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    value="support"
                                                    id="support"
                                                    name="inquiryType"
                                                    checked={formData.inquiryType === 'support'}
                                                    onChange={handleChange}
                                                    className="focus:ring-blue-500"
                                                />
                                                <label htmlFor="support" className="text-black">Customer Support</label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    value="feedback"
                                                    id="feedback"
                                                    name="inquiryType"
                                                    checked={formData.inquiryType === 'feedback'}
                                                    onChange={handleChange}
                                                    className="focus:ring-blue-500"
                                                />
                                                <label htmlFor="feedback" className="text-black">Feedback</label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    value="partnership"
                                                    id="partnership"
                                                    name="inquiryType"
                                                    checked={formData.inquiryType === 'partnership'}
                                                    onChange={handleChange}
                                                    className="focus:ring-blue-500"
                                                />
                                                <label htmlFor="partnership" className="text-black">Business Partnership</label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    value="other"
                                                    id="other"
                                                    name="inquiryType"
                                                    checked={formData.inquiryType === 'other'}
                                                    onChange={handleChange}
                                                    className="focus:ring-blue-500"
                                                />
                                                <label htmlFor="other" className="text-black">Other</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label htmlFor="message" className="text-lg font-medium text-black">Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Tell us how we can help..."
                                            className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-red-700 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                                        disabled={formStatus === 'submitting'}
                                    >
                                        {formStatus === 'submitting' ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    />
                                                </svg>
                                                Sending...
                                            </span>
                                        ) : formStatus === 'success' ? (
                                            <span className="flex items-center justify-center">
                                                <svg
                                                    className="mr-2 h-4 w-4"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M5 13L9 17L19 7"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                Message Sent!
                                            </span>
                                        ) : formStatus === 'error' ? (
                                            <span className="flex items-center justify-center">
                                                <svg
                                                    className="mr-2 h-4 w-4"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                Something went wrong. Please try again.
                                            </span>
                                        ) : (
                                            'Send Message'
                                        )}
                                    </button>
                                </form>
                            </div>

                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="flex flex-col"
                        >
                            <div className="mb-6">
                                <h2 className="mb-4 text-2xl font-bold">Our Location</h2>
                                <p className="text-gray-600">
                                    Visit our headquarters in the heart of Tasty City. We're open Sunday through Friday, 9am to 5pm.
                                </p>
                            </div>
                            <div className="flex-1 overflow-hidden rounded-xl border bg-gray-100">
                                {/* This would be a real map in production */}
                                <div className="relative h-full w-full min-h-[300px]">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1035.4414958338639!2d87.26815313883354!3d26.66485436332049!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2snp!4v1745049255744!5m2!1sen!2snp"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0, position: "absolute", top: 0, left: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-3xl text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="mb-2 text-3xl font-bold">Frequently Asked Questions</h2>
                            <p className="mb-12 text-gray-600">Find answers to common questions about our food delivery service.</p>
                        </motion.div>

                        {/* <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>How do I place an order?</AccordionTrigger>
                                    <AccordionContent>
                                        You can place an order through our website or mobile app. Simply browse restaurants, select your
                                        items, add them to your cart, and proceed to checkout. You can pay online or choose cash on
                                        delivery.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>What are your delivery hours?</AccordionTrigger>
                                    <AccordionContent>
                                        Our delivery hours vary by location and restaurant availability. Most of our partner restaurants
                                        deliver from 10:00 AM to 10:00 PM, but some may offer extended hours. You can check specific
                                        delivery times on each restaurant's page.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>How much is the delivery fee?</AccordionTrigger>
                                    <AccordionContent>
                                        Delivery fees vary based on your distance from the restaurant and current demand. The exact fee will
                                        be displayed before you complete your order. We also offer free delivery on orders above $20 from
                                        select restaurants.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-4">
                                    <AccordionTrigger>Can I track my order?</AccordionTrigger>
                                    <AccordionContent>
                                        Yes, you can track your order in real-time through our app or website. Once your order is confirmed,
                                        you'll receive updates on its preparation and delivery status. You can also contact the delivery
                                        person directly through the app.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-5">
                                    <AccordionTrigger>How can I become a delivery partner?</AccordionTrigger>
                                    <AccordionContent>
                                        To become a delivery partner, visit our "Careers" page and apply for the delivery partner position.
                                        You'll need a vehicle, a valid driver's license, and to pass a background check. Our team will guide
                                        you through the onboarding process.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </motion.div> */}
                    </div>
                </div>
            </section>

            {/* Support Hours */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-3xl rounded-xl bg-gradient-to-r from-red-700 to-amber-500 p-8 text-white shadow-lg">
                        <div className="grid gap-8 md:grid-cols-2">
                            <div>
                                <h2 className="mb-4 text-2xl font-bold">Customer Support Hours</h2>
                                <p className="mb-6">
                                    Our dedicated support team is available to assist you with any questions or issues.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>Monday - Friday:</span>
                                        <span className="font-semibold">8:00 AM - 10:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Saturday:</span>
                                        <span className="font-semibold">9:00 AM - 8:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Sunday:</span>
                                        <span className="font-semibold">10:00 AM - 6:00 PM</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-red-700">
                                    <FaMessage size={25} />
                                </div>
                                <p className="mb-4 text-center">Need immediate assistance?</p>
                                <button className="bg-white text-red-700 hover:bg-gray-100 flex gap-2 items-center px-3 py-2 rounded">
                                    <FaMessage />
                                    Live Chat
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactUs;
