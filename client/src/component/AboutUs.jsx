import React from 'react';
import { Helmet } from 'react-helmet'
import { motion } from 'framer-motion'
import { FaHeart } from "react-icons/fa6"
import { IoStar } from "react-icons/io5"
import { FaUsers } from "react-icons/fa"
import { IoLocation } from "react-icons/io5"
import { FaRegClock } from "react-icons/fa"
import { HiGiftTop } from "react-icons/hi2"
import { FaTruck } from "react-icons/fa"
import CEO from '../assets/CEO.jpg'
import about from '../assets/about1.jpg'

const AboutUs = () => {

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

    // Team members data
    const teamMembers = [
        {
            name: "Shuvam Shrestha",
            role: "Founder & CEO",
            image: CEO,
            bio: "Shuvam founded Khaja with a passion for connecting people with great local food.",
        },
        {
            name: "Michael Chen",
            role: "CTO",
            image: "/placeholder.svg?height=300&width=300&text=Michael+C",
            bio: "Michael leads our technology team, ensuring our platform is fast, reliable, and easy to use. He previously worked at several successful tech startups.",
        },
        {
            name: "Priya Patel",
            role: "Head of Operations",
            image: "/placeholder.svg?height=300&width=300&text=Priya+P",
            bio: "Priya oversees our day-to-day operations, including our delivery network and restaurant partnerships. She's an expert in logistics and supply chain management.",
        },
        {
            name: "David Rodriguez",
            role: "Marketing Director",
            image: "/placeholder.svg?height=300&width=300&text=David+R",
            bio: "David leads our marketing efforts, helping us connect with food lovers everywhere. He brings creative strategies that have helped us grow rapidly.",
        },
    ]

    // Milestones data
    const milestones = [
        {
            year: "2018",
            title: "Company Founded",
            description: "FoodDelivery was founded with a mission to connect people with their favorite local restaurants.",
        },
        {
            year: "2019",
            title: "Expanded to 10 Cities",
            description: "After a successful launch, we expanded our service to 10 major cities across the country.",
        },
        {
            year: "2020",
            title: "1 Million Orders",
            description: "We celebrated our millionth order and continued to grow our network of restaurant partners.",
        },
        {
            year: "2021",
            title: "Mobile App Launch",
            description: "We launched our mobile app, making it even easier for customers to order their favorite food.",
        },
        {
            year: "2022",
            title: "International Expansion",
            description: "We began our international expansion, bringing FoodDelivery to customers around the world.",
        },
        {
            year: "2023",
            title: "Sustainability Initiative",
            description:
                "We launched our sustainability initiative, focusing on eco-friendly packaging and carbon-neutral delivery.",
        },
    ]

    return (
        <div className="min-h-screen bg-white">
            <Helmet>
                <title>About</title>
            </Helmet>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-orange-50 to-amber-50 py-20 md:py-28">
                <div className="container mx-auto px-4">
                    <div className="grid items-center gap-12 md:grid-cols-2">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                                About <span className="text-red-700">Khaja</span>
                            </h1>
                            <p className="mt-6 text-lg text-gray-600">
                                We're on a mission to transform the way people experience food delivery. With a passion for great food
                                and exceptional service, we connect hungry customers with the best local restaurants.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-4">
                                <button className="bg-red-700 hover:bg-red-600 px-2 py-1 rounded-full text-white">Join Our Team</button>
                                <button className="bg-white border border-black px-2 py-1 rounded-full hover:bg-gray-200">Partner With Us</button>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="relative mx-auto max-w-md"
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src={about}
                                    alt="About FoodDelivery"
                                    width={600}
                                    height={600}
                                    className="w-full h-auto"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-3xl text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
                            <div className="mt-6 space-y-6 text-lg text-gray-600">
                                <p>
                                    Khaja was born in 2018 from a simple idea: make it easier for people to enjoy their favorite
                                    restaurant meals at home. Our founder, Shuvam Shrestha, was frustrated with the limited options and poor
                                    service of existing food delivery platforms.
                                </p>
                                <p>
                                    What started as a small operation connecting a handful of restaurants with local customers has grown
                                    into a nationwide service with thousands of restaurant partners. Throughout our journey, we've
                                    remained committed to our core values: quality, convenience, and community.
                                </p>
                                <p>
                                    Today, we're proud to serve millions of customers, providing not just food delivery but a complete
                                    dining experience. We work closely with restaurants to ensure that every meal arrives just as it would
                                    be served in the restaurant itself.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Our Values Section */}
            <section className="bg-gray-50 py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="mb-12 text-center"
                    >
                        <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
                        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                            These core principles guide everything we do at Khaja.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid gap-8 md:grid-cols-3"
                    >
                        <motion.div variants={itemVariants} className="rounded-xl bg-white p-8 shadow-sm">
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-700">
                                <FaHeart size={20} />
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-gray-900">Customer First</h3>
                            <p className="text-gray-600">
                                We prioritize our customers' needs and preferences, constantly seeking ways to improve their experience
                                with our service.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="rounded-xl bg-white p-8 shadow-sm">
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-700">
                                <IoStar size={20} />
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-gray-900">Quality Assurance</h3>
                            <p className="text-gray-600">
                                We maintain high standards for food quality, delivery service, and customer support to ensure
                                satisfaction with every order.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="rounded-xl bg-white p-8 shadow-sm">
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-700">
                                <FaUsers size={20} />
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-gray-900">Community Support</h3>
                            <p className="text-gray-600">
                                We're committed to supporting local restaurants and communities, helping them thrive in an increasingly
                                digital world.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="mb-12 text-center"
                    >
                        <h2 className="text-3xl font-bold text-gray-900">How Khaja Works</h2>
                        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                            Our streamlined process makes ordering food simple and convenient.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid gap-8 md:grid-cols-4"
                    >
                        <motion.div variants={itemVariants} className="text-center">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-700">
                                <IoLocation size={30} />
                            </div>
                            <div className="relative">
                                <div className="absolute right-0 top-10 hidden h-1 w-full bg-red-200 md:block"></div>
                                <div className="inline-block rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white">
                                    Step 1
                                </div>
                            </div>
                            <h3 className="mt-4 text-xl font-semibold text-gray-900">Find Restaurants</h3>
                            <p className="mt-2 text-gray-600">
                                Enter your address to discover restaurants that deliver to your location.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="text-center">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-700">
                                <FaRegClock size={30} />
                            </div>
                            <div className="relative">
                                <div className="absolute right-0 top-10 hidden h-1 w-full bg-red-200 md:block"></div>
                                <div className="inline-block rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white">
                                    Step 2
                                </div>
                            </div>
                            <h3 className="mt-4 text-xl font-semibold text-gray-900">Choose Your Food</h3>
                            <p className="mt-2 text-gray-600">Browse menus, read reviews, and select your favorite dishes.</p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="text-center">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-700">
                                <HiGiftTop size={30} />
                            </div>
                            <div className="relative">
                                <div className="absolute right-0 top-10 hidden h-1 w-full bg-red-200 md:block"></div>
                                <div className="inline-block rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white">
                                    Step 3
                                </div>
                            </div>
                            <h3 className="mt-4 text-xl font-semibold text-gray-900">Place Your Order</h3>
                            <p className="mt-2 text-gray-600">
                                Customize your order, add special instructions, and proceed to checkout.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="text-center">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-700">
                                <FaTruck size={30} />
                            </div>
                            <div className="relative">
                                <div className="inline-block rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white">
                                    Step 4
                                </div>
                            </div>
                            <h3 className="mt-4 text-xl font-semibold text-gray-900">Enjoy Delivery</h3>
                            <p className="mt-2 text-gray-600">
                                Track your order in real-time and enjoy your food delivered to your doorstep.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Team Section */}
            <section className="bg-gray-50 py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="mb-12 text-center"
                    >
                        <h2 className="text-3xl font-bold text-gray-900">Meet Our Team</h2>
                        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                            The passionate people behind Khaja who make it all happen.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
                    >
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={member.name}
                                variants={itemVariants}
                                className="overflow-hidden rounded-xl bg-white shadow-sm"
                            >
                                <div className="aspect-square overflow-hidden">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        width={300}
                                        height={300}
                                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                                    <p className="mb-4 text-red-700">{member.role}</p>
                                    <p className="text-gray-600">{member.bio}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Milestones Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="mb-12 text-center"
                    >
                        <h2 className="text-3xl font-bold text-gray-900">Our Journey</h2>
                        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                            Key milestones in our growth from startup to industry leader.
                        </p>
                    </motion.div>

                    <div className="mx-auto max-w-4xl">
                        <div className="relative">
                            <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-red-200"></div>
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="space-y-12"
                            >
                                {milestones.map((milestone, index) => (
                                    <motion.div
                                        key={milestone.year}
                                        variants={itemVariants}
                                        className={`relative flex ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"} items-center gap-8`}
                                    >
                                        <div className="flex-1">
                                            <div className={`${index % 2 === 0 ? "text-right" : "text-left"} rounded-lg border bg-card text-card-foreground shadow-sm`}>
                                                <div className="p-6 pt-0">
                                                    <h3 className="text-xl font-semibold text-gray-900">{milestone.title}</h3>
                                                    <p className="mb-2 text-red-700">{milestone.year}</p>
                                                    <p className="text-gray-600">{milestone.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute left-1/2 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-red-700 text-white">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1"></div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="bg-gradient-to-r from-red-700 to-amber-700 py-20 text-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="mb-12 text-center"
                    >
                        <h2 className="text-3xl font-bold">What Our Customers Say</h2>
                        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
                            Don't just take our word for it - hear from some of our satisfied customers.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid gap-8 md:grid-cols-3"
                    >
                        <motion.div variants={itemVariants} className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
                            <div className="mb-4 flex">
                                {[...Array(5)].map((_, i) => (
                                    <IoStar key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="mb-6 italic text-white/90">
                                "Khaja has completely changed how I enjoy restaurant food at home. The delivery is always on
                                time, and the food arrives hot and fresh. Their customer service is exceptional!"
                            </p>
                            <div className="flex items-center">
                                <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-red-200">
                                    <img src="/placeholder.svg?height=48&width=48&text=JD" alt="John D." width={48} height={48} />
                                </div>
                                <div>
                                    <h4 className="font-semibold">John D.</h4>
                                    <p className="text-sm text-white/80">Loyal customer since 2019</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
                            <div className="mb-4 flex">
                                {[...Array(5)].map((_, i) => (
                                    <IoStar key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="mb-6 italic text-white/90">
                                "As a busy professional, Khaja saves me so much time. The app is intuitive, and I love being able
                                to track my delivery in real-time. Plus, the variety of restaurants is impressive!"
                            </p>
                            <div className="flex items-center">
                                <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-red-200">
                                    <img src="/placeholder.svg?height=48&width=48&text=AM" alt="Amanda M." width={48} height={48} />
                                </div>
                                <div>
                                    <h4 className="font-semibold">Amanda M.</h4>
                                    <p className="text-sm text-white/80">Loyal customer since 2020</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
                            <div className="mb-4 flex">
                                {[...Array(5)].map((_, i) => (
                                    <IoStar key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="mb-6 italic text-white/90">
                                "I own a small restaurant, and partnering with Khaja has significantly increased our business.
                                Their platform is easy to use, and their delivery drivers are professional and reliable."
                            </p>
                            <div className="flex items-center">
                                <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-red-200">
                                    <img src="/placeholder.svg?height=48&width=48&text=RL" alt="Robert L." width={48} height={48} />
                                </div>
                                <div>
                                    <h4 className="font-semibold">Robert L.</h4>
                                    <p className="text-sm text-white/80">Restaurant Partner</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-3xl rounded-2xl bg-gray-50 p-8 text-center shadow-sm">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold text-gray-900">Join the Khaja Family</h2>
                            <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
                                Whether you're a food lover, restaurant owner, or potential team member, we'd love to connect with you.
                            </p>
                            <div className="mt-8 flex flex-wrap justify-center gap-4">
                                <button className="bg-red-700 hover:bg-red-600 px-2 py-1 rounded-full">Order Now</button>
                                <button className="outline px-2 py-1 rounded-full hover:bg-gray-200">Partner With Us</button>
                                <button className="outline px-2 py-1 rounded-full hover:bg-gray-200">Join Our Team</button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AboutUs;
