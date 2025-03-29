import React from 'react';

const AboutUs = () => {
    return (
        <div className="bg-gray-100 min-h-screen py-10 px-6 md:px-16">
            <div className="container mx-auto text-center md:text-left max-w-4xl">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-6">About Us</h1>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    Welcome to <span className="font-semibold text-red-500">Khaja</span>, your ultimate food delivery companion! We are dedicated to delivering
                    fresh, delicious, and high-quality meals straight to your doorstep. Whether you're at home, at work,
                    or on the go, we ensure you never miss out on great food.
                </p>

                <h2 className="text-3xl font-semibold text-gray-900 mt-8">Our Story</h2>
                <p className="text-lg text-gray-700 mt-4 leading-relaxed">
                    Khaja was founded with a simple vision: to revolutionize the way people experience food. We believe
                    that everyone deserves access to a variety of flavors, cuisines, and gourmet experiences with just
                    a few taps on their device. From local favorites to international delights, we bring them all together
                    for you.
                </p>

                <h2 className="text-3xl font-semibold text-gray-900 mt-8">Why Choose Us?</h2>
                <ul className="list-disc list-inside text-lg text-gray-700 mt-4 space-y-2">
                    <li><span className="font-semibold text-red-500">Speedy Delivery:</span> Get your food hot and fresh in no time.</li>
                    <li><span className="font-semibold text-red-500">Diverse Cuisines:</span> Explore a variety of dishes from top restaurants.</li>
                    <li><span className="font-semibold text-red-500">Affordable & Exciting Offers:</span> Enjoy great deals and discounts.</li>
                    <li><span className="font-semibold text-red-500">Easy Ordering:</span> A seamless and user-friendly experience.</li>
                    <li><span className="font-semibold text-red-500">24/7 Support:</span> Our team is here to assist you anytime.</li>
                </ul>

                <h2 className="text-3xl font-semibold text-gray-900 mt-8">Our Mission</h2>
                <p className="text-lg text-gray-700 mt-4 leading-relaxed">
                    We are on a mission to connect people with great food experiences. Whether you're craving comfort food,
                    a healthy meal, or something adventurous, Khaja ensures you get the best taste with the highest convenience.
                </p>

                <h2 className="text-3xl font-semibold text-gray-900 mt-8">Join Us Today!</h2>
                <p className="text-lg text-gray-700 mt-4 leading-relaxed">
                    Order your favorite meals now and experience the best food delivery service with Khaja. Because great food
                    should always be just a few clicks away!
                </p>
            </div>
        </div>
    );
};

export default AboutUs;
