import React, { useEffect, useState } from "react"

const useMobile = (breakpoint = 768) => {
    const [ismobile,setIsMobile] = useState(window.innerWidth < breakpoint)

    const handleResize = () => {
        const check = window.innerWidth < breakpoint
        setIsMobile(check)
    }

    useEffect(()=>{
        handleResize()

        window.addEventListener('resize',handleResize)

        return ()=>{
            window.removeEventListener('resize',handleResize)
        }
    },[])

    return [ ismobile ]
}

export default useMobile