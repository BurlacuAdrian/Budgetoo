import { useNavigate } from "react-router-dom"

const InsightsPage = () => {

  const navigate = useNavigate()
  const handleCancelButton = () => {
    navigate('/home')
  }

  return (
    <div className='bg-primaryBudgetoo h-[100dvh] w-[100dvw] flex flex-col'>
      <div className="flex-grow"></div>
      <div className='bg-white w-full h-[90%] mt-auto rounded-t-[4rem] flex flex-col items-center pt-6 px-8'>

        <div className="relative w-full flex items-start" onClick={handleCancelButton}>
          <img src='./cancel.svg' className="size-8 inline " />
          <span className="absolute w-full text-center font-bold text-xl">Insights</span>
        </div>

        <div className="grid grid-cols-3 w-full p-4 mt-8 gap-6">
          <span className="text-3xl col-span-3 flex items-center font-bold">See stats about your spending habits!</span>
        </div>

      

      </div>
    </div>
  )
}

export default InsightsPage