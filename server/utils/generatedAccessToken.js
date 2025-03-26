import jwt from 'jsonwebtoken'


const generatedaccessToken = async (userId)=>{
    const token = await jwt.sign({ id : userId},process.env.SECRET_ACCESS_KEY_TOKEN,{ expiresIn : '5h'})
    return token
}

export default generatedaccessToken