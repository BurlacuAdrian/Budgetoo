import {formatCurrency, getMonthName} from '../../JS/Utils.js'
import { useContext, useEffect, useState } from 'react'
import { useDataContext } from '../Wrappers/DataContext.jsx';
import MonthsSlider from '../../Components/MonthsSlider.jsx';
import EditBudget from './EditBudget.jsx';


const HeroSection = () => {

  var dataContext = useDataContext()
  // var dataConext = useContext(DataC)
  if (!dataContext) {
    console.log(dataContext)
    return <div>Loading hero section...</div>; // TODO some other fallback UI
  }
  const { data, setData } = dataContext

  const [currencySymbol, setCurrencySymbol] = useState('$')
  const [progress, setProgress] = useState(70)
  const currencyName = "EUR"
  const [displayedTotal, setDisplayedTotal] = useState(formatCurrency((data?.totalSpent || 1234), currencyName))
  //TODO

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)

  const handleBudgetClick = () => {
    setIsBudgetModalOpen(true)
  }

  useEffect( () => {
    setDisplayedTotal(formatCurrency((data?.totalSpent || 1234), currencyName))
  }, [data])

  return (<div className=' w-full h-[35%] flex flex-col justify-around'>
    <div className='h-[50%] flex flex-col items-center justify-center'>
      <span className='text-white text-[3rem] font-bold'>{displayedTotal}</span>
      {/* <span className='text-gray-300 text-[2rem] font-bold underline '>{`${getMonthName(data?.month)}`}</span> */}
      <MonthsSlider data={data} setData={setData}/>
    </div>
    <div className='h-[20%] px-4' >
      <div className='flex justify-between px-6 mb-4'>
        <span className='text-white text-[1.5rem]'>Monthly budget</span>
        <span className='text-gray-400 text-[1.5rem]' onClick={handleBudgetClick}>{`${formatCurrency(data.budget, currencyName)}`}</span>
      </div>
      <div className="relative w-full h-4 bg-gray-300 rounded-full overflow-hidden shadow-md">
        <div
          className="h-full bg-blue-900 rounded-full shadow-lg"
          style={{ width: `${(data?.totalSpent || 1234)/data.budget*100}%` }}
        ></div>
      </div>
    </div>


      {isBudgetModalOpen && (<EditBudget closeModal={()=>{setIsBudgetModalOpen(false)}} data={data}/>)}
  </div>)
}

export default HeroSection