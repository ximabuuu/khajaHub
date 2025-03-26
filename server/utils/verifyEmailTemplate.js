const verifyEmailTemplate = ({name,url})=>{
    return`
    <p> Dear ${name} </p>
    <p>Thank you for registering in Khaja.</p>
    <a href=${url} style="color: white;background-color: #252525;margin-top: 10px" >
    Verify Email
    </a>

    `
}

export default verifyEmailTemplate