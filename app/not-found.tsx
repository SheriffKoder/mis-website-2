import Image from "next/image";

// // show the closest not found or error page in case meal not found (in database)
// // put before trying to access the meal variable
// if (!meal) {
//     notFound(); // built-in function
//   }


const notfound = () => {
  return (
    <div className='h-[100vh] flex flex-col items-center justify-center gap-2'>
      This page does not exist
      <div id="logo" className='w-[calc(2rem*1.5)] h-[calc(0.75rem*1.5)] relative'>
                <Image src="/Logo/Logo_white.png" alt="company logo" fill ></Image>
      </div>
    </div>
  )
}

export default notfound