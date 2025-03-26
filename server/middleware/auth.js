import jwt from 'jsonwebtoken'

const auth = async (request,response,next)=>{
    try {
        const token = request.cookies.accessToken || request.headers?.authorization?.split(" ")[1] /// splited token

        console.log("Extracted Token:", token)
        

        if (!token) {
            return response.status(401).json({
                message : "You are not logged in" //provide token
            })
        }

        const decode = jwt.verify(token,process.env.SECRET_ACCESS_KEY_TOKEN)
        console.log(decode)

        if (!decode) {
            return response.status(401).json({
                message : "unauthorized access"
            })
        }

        request.userId = decode.id

        next()

        console.log(request.userId)

        

    } catch (error) {
        return response.status(500).json({
            message : "You are not logged in",//error.message || error,
            error : true,
            success : false
        })
    }
}

export default auth