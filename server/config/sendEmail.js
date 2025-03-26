import { Resend } from 'resend';
import dotenv from 'dotenv'
dotenv.config()

if(!process.env.RESEND_API){
    console.log("Provide RESEN_API inside .env file")
}

const resend = new Resend('re_grug5h3b_Y28qDkUSe28e7HsGPdgHwm8X');

const sendEmail = async({ sendTo, subject, html })=>{
    try {
        const { data, error } = await resend.emails.send({
            from: 'Khaja <onboarding@resend.dev>',
            to: sendTo,
            subject: subject,
            html: html,
          });

          if (error) {
            return console.error({ error });
          }
          return data
        
    } catch (error) {
        console.log(error)
    }
}

export default sendEmail