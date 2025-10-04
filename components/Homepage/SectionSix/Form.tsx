"use client"

import Button from "@/components/ui/Button";
import React, { useState } from "react"
import { ChangeEventHandler, FormEventHandler } from "react";


const Form = () => {

  ////////////////////////////////////////////////////////////////////////////////////
  const [emailBody, setEmailBody] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { name, email, phone, message } = emailBody;

  // const messageContainer_inquiry = useRef<HTMLDivElement>(null)

  const handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = ({ target }) => {

    const { name, value } = target;
    setEmailBody({ ...emailBody, [name]: value });

  }


  //handle the inquiry submission
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    setLoading(true);

    const res = await fetch("/api/mail", {
      method: "POST",
      body: JSON.stringify(emailBody),

    }).then((res) => res.json());
    console.log(res);

    setLoading(false);
    setSuccess(true);

  }

  const consoleHandleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log("Form submitted");
    alert("This is a demo version, the form should submit in this stage.");
  }

  return (
    <form className="flex flex-col gap-4 px-[1rem] md:px-[2rem]" onSubmit={consoleHandleSubmit}
      id="contact__form">

      <div className="flex flex-col gap-4">


        {/* name */}
        <div className="flex flex-col gap-2">

          <label className="FormLabel" htmlFor="name">
            Name
          </label>

          <input
            className="FormInput h-[2.5rem]"
            id="name"
            maxLength={35}
            name="name"
            value={name}
            onChange={handleChange}
            required
            type="text"
            placeholder="John Smith"
          />
        </div>


        {/* email */}
        <div className="flex flex-col gap-2">
          <label className="FormLabel" htmlFor="email">
            Email
          </label>
          <input
            className="FormInput h-[2.5rem]"
            id="email"
            maxLength={35}
            name="email"
            value={email}
            onChange={handleChange}
            required
            type="email"
            placeholder="youremail@email.com"
          />
        </div>

        {/* phone */}
        <div className="flex flex-col gap-2">
          <label className="FormLabel" htmlFor="email">
            Phone
          </label>
          <input
            className="FormInput h-[2.5rem]"
            id="phone"
            maxLength={35}
            name="phone"
            value={phone}
            onChange={handleChange}
            required
            type="text"
            placeholder="+00123456789" />
        </div>

      </div>

      {/* text-area, email body */}
      <div className="textArea_container flex flex-col gap-2 mdx:gap-0 mdx:flex-row h-[7rem] xl:h-[12rem] 
      items-center mdx:items-start"
        id="contact__text-area">

        <label className="FormLabel" htmlFor="inquiry">
          More details
        </label>

        <textarea
          className="border-0 FormInput h-full w-full py-2 resize-none"
          name="message"
          value={message}
          onChange={handleChange}
          required
          id="inquiry"
          placeholder="describe your inquiry"
        >

        </textarea>



      </div>

      <div className="flex flex-col gap-0 mdx:gap-0 mdx:flex-row items-center
       w-full"
        id="contact__submit-button">

        {/* the submit button */}
        <div className="mt-[1rem] flex w-full justify-center">
          {/* <button type="submit"
            className="sm:ButtonText md2:Paragraph1 px-2 md2:py-1
              flex items-center justify-center rounded-full w-full
              neon_button transition-all duration-100 ease-out">
            {loading ? <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"/> : "Discover the power of innovation"}
          </button> */}

          <Button text={loading ? <div className="mx-auto animate-spin h-5 w-5 border-2 border-black rounded-full border-t-transparent"/> : "Discover the power of innovation"} 
          className="w-full"
          type="submit"
          defaultAnimate={true}/>

        </div>
      </div>

      {/* email confirmation */}
      {success && (
        <div className="flex flex-col gap-2 mt-4">
            <p className="text-green-500 bg-green-500/20 text-center italic rounded-xl py-2 px-4">Thank you for your message! <br/> We will get back to you as soon as possible.</p>
        </div>
      )}

    </form>
  )
}

export default Form
