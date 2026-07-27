import nodemailer from "nodemailer";
export const sendMail=async(options)=>{
try{
const transporter=nodemailer.createTransport({
    service:process.env.SMPT_SERVICE,
    auth:{
        user:process.env.SMPT_MAIL,
        pass:process.env.SMPT_PASSWORD
    }
})
const mailOptions={
    from:process.env.SMPT_MAIL,
    to:options.email,
    subject:options.subject,
    text:options.message
}
await transporter.sendMail(mailOptions);
}catch(err){
 console.log(err)
}

}