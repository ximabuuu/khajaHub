import React, { useEffect, useState } from 'react';
import '../App.css'
import bike from '../assets/bike.png'


const BikeDeliveryAnimation = ({ isDelivering }) => {
    const [animationFinished, setAnimationFinished] = useState(false);

    useEffect(() => {
        if (isDelivering) {
            setAnimationFinished(false)
            setTimeout(() => {
                setAnimationFinished(true);
            }, 3000)
        }
    }, [isDelivering]);

    if (animationFinished) return null

    return (
        <div className={`absolute top-0 left-0 z-50`}>
            <img
                src="https://res.cloudinary.com/drcjnrrbr/image/upload/v1743425705/1743346000485_ctflym.png"
                alt="Bike"
                className="w-20 md:w-30 lg:w-40 animate-bike-delivery"
            />
        </div>
    )
}

export default BikeDeliveryAnimation;
