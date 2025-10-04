

//Part 11.2 - send email with data passed to this api

// import nodemailer from "nodemailer";

// if you created a new key the IAM pass should be converted using a python script as mentioned here
// https://docs.aws.amazon.com/ses/latest/dg/smtp-credentials.html


export const POST = async (req:Request) => {

    try {

        //get the url and the user session
        const emailBody = await req.json();
        console.log(emailBody);

        // send post request to the email service
        const apiUrl = "https://script.google.com/macros/s/AKfycbwt0ke3tlT6mi6pYPYzABovb_vgmwYzKEqAVPkHji0swZSg5X_g4vs0ze2TB2lolG2lBg/exec";
        await fetch(apiUrl, {
            method: "POST",
            body: JSON.stringify(emailBody),
        });

        // 200: operation succeeded
        return new Response(JSON.stringify("Email Sent"), {status: 200});


    } catch {
        return new Response(JSON.stringify("Failed to send email"), {status: 500});
    }

}