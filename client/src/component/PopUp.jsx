import React, { useState, useEffect } from "react";

const Popup = ({ imageUrl }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const lastPopupTime = localStorage.getItem("lastPopupTime");
        const currentTime = Date.now();
        
        // Show popup if more than 3 minutes (180000 ms) have passed since last shown
        if (!lastPopupTime || currentTime - lastPopupTime > 180000) {
            setIsOpen(true);
            localStorage.setItem("lastPopupTime", currentTime);
        }
    }, []);

    const closePopup = () => {
        setIsOpen(false);
    };

    return (
        isOpen && (
            <div className="fixed top-0 bottom-0 left-0 right-0 inset-0 p-4 max-h-[100vh] flex items-center justify-center bg-black/0 z-[9999]" onClick={closePopup}>
                <div className="relative bg-white border border-gray-500 p-5 rounded-lg shadow-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                    {/* Close Button */}
                    <button
                        className="absolute top-3 right-3 bg-black text-white p-2 rounded-full text-sm hover:bg-gray-800"
                        onClick={closePopup}
                    >
                        ✖
                    </button>
                    {/* Popup Image */}
                    <img
                        src={imageUrl}
                        alt="Popup"
                        className="w-full rounded-lg"
                        onError={(e) => (e.target.src = "https://via.placeholder.com/400")}
                    />
                </div>
            </div>
        )
    );
};

export default Popup;
