const forgotPasswordTemplate = ({ name , otp })=>{
    return `
    <div>
        <p> Dear, ${name}</p>
        <p>You have requested a password reset. Please use following OTP code to reset your password.</p>
        <div style="background:green;font-size:20px;padding:20px;text-align:center;font-weight:800;">${otp}</div>
        <p>This OTP is valid for 1 hour only. Enter this otp in the khaja website to proceed with resetting your password.</p>
        <br/>
        </br>
        <p>Thank You</p>
        <p>Khaja</p>
    </div>
    `
}

export default forgotPasswordTemplate