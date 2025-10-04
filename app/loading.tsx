import Image from "next/image";

function MyLoading() {

    return (
      <div className="absolute top-0 left-0 w-[100%] min-h-[100vh] bg-[#000000] 
      flex items-center justify-center flex-col gap-2 fadeIn_animation"
      id="loading_icon__container">
          <div id="loading_icon" className="">
            <div id="logo" className='w-[calc(2rem*1.5)] h-[calc(0.75rem*1.5)] relative'>
                <Image src="/Logo/Logo_white.png" alt="company logo" fill ></Image>
            </div>
          </div>
          {/* <p className="text-white text-[13px] dark:text-[#cc2750d3] text-[#d6003580]">
              Loading...
          </p> */}
      </div>
    )
  }


  export default MyLoading;