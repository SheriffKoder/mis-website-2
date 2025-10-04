"use client"

  
// if ..         throw new Error("Invalid filter.");

// https://nextjs.org/docs/app/api-reference/file-conventions/error

{/* <ErrorBoundary fallback={<Error />}>
    // component
</ErrorBoundary> */}


const GeneralError = ({error}: {
  error: Error & { digest?: string }
  reset: () => void
}) => {

  return (
    <div className='h-[100vh] flex flex-col items-center justify-center' 
    id="ErrorText">
        <h2>An error occured!</h2>
        <p>{error.message}</p>    {/* invalid filter */}
        
        {/* // Attempt to recover by trying to re-render the segment */}
        {/* <button onClick={() => reset()}>
          Try again
        </button> */}
    </div>
  )
}

export default GeneralError