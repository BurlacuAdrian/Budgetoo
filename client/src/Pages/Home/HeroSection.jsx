import { formatCurrency, getMonthName } from '../../JS/Utils.js'
import { useContext, useEffect, useState } from 'react'
import { useDataContext } from '../Wrappers/DataContext.jsx';
import MonthsSlider from '../../Components/MonthsSlider.jsx';
import EditBudget from './EditBudget.jsx';
import useDeviceType from '../../Hooks/useDeviceType.jsx'


const HeroSection = () => {

  var dataContext = useDataContext()
  // var dataConext = useContext(DataC)
  if (!dataContext) {
    console.log(dataContext)
    return <div>Loading hero section...</div>; // TODO some other fallback UI
  }
  const { data, setData } = dataContext
  const device = useDeviceType()

  const [displayedTotal, setDisplayedTotal] = useState(formatCurrency(formatCurrency(data?.totalSpent || 0, data?.mainCurrency)))

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)

  const handleBudgetClick = () => {
    setIsBudgetModalOpen(true)
  }

  useEffect(() => {
    setDisplayedTotal(formatCurrency(data?.totalSpent || 0, data?.mainCurrency))
  }, [data])

  const [selectedMonth, setSelectedMonth] = useState(data.month);
  const [selectedYear, setSelectedYear] = useState(data.year);

  const displayMonth = selectedMonth ? `${selectedMonth}`.padStart(2, '0') : 'MM';

  const handleMonthYearChange = (event) => {
    const [year, month] = event.target.value.split('-'); // Parse the year and month from the YYYY-MM format
    setSelectedMonth(Number(month)); // Convert month to a number
    setSelectedYear(Number(year));   // Convert year to a number

    setData(oldData=>{
      const newData = {
        ...oldData,
        month: Number(month),
        year: Number(year)
      }
      return newData
    })
  };

  if (device.type == 'mobile') {
    return (<div className=' w-full h-[35%] flex flex-col justify-around'>
      <div className='h-[50%] flex flex-col items-center justify-center'>
        <span className='text-white text-[3rem] font-bold'>{displayedTotal}</span>
        {/* <span className='text-gray-300 text-[2rem] font-bold underline '>{`${getMonthName(data?.month)}`}</span> */}
        <MonthsSlider data={data} setData={setData} />
      </div>
      <div className='h-[20%] px-4' >
        <div className='flex justify-between px-6 mb-4'>
          <span className='text-white text-[1.5rem]'>Monthly budget</span>
          <span className='text-white underline text-[1.5rem]' onClick={handleBudgetClick}>{`${formatCurrency(data.budget, data.mainCurrency)}`}</span>
        </div>
        <div className="relative w-full h-4 bg-gray-300 rounded-full overflow-hidden shadow-md">
          <div
            className="h-full bg-blue-900 rounded-full shadow-lg"
            style={{ width: `${(data?.totalSpent || 1234) / data.budget * 100}%` }}
          ></div>
        </div>
      </div>


      {isBudgetModalOpen && (<EditBudget closeModal={() => { setIsBudgetModalOpen(false) }} data={data} />)}
    </div>)
  }

  return (

    <div className='bg-white w-full h-[20%] flex rounded-b-[6rem]'>

      <span className='h-full w-[10%] min-w-[10%] max-w-[10w]'></span>

      <div className='w-full h-full flex justify-around items-center'>
        <div className='flex items-center justify-around gap-40'>
          <input type='month' value={`${selectedYear}-${displayMonth}`} onChange={handleMonthYearChange} className='text-[1.5rem] ' autoFocus />

          <span className='text-white text-[3rem] bg-primaryBudgetoo py-8 px-16 rounded-[3rem]'>{displayedTotal}</span>
        </div>


        <div className='w-[30%]' >
          <div className='flex justify-between px-6 mb-4'>
            <span className='text-[1.5rem]'>Monthly budget</span>
            <span className='underline text-[1.5rem]' onClick={handleBudgetClick}>{`${formatCurrency(data.budget, data.mainCurrency)}`}</span>
          </div>
          <div className="relative w-full h-4 bg-gray-300 rounded-full overflow-hidden shadow-md">
            <div
              className="h-full bg-blue-900 rounded-full shadow-lg"
              style={{ width: `${(data?.totalSpent || 1234) / data.budget * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {isBudgetModalOpen && (<EditBudget closeModal={() => { setIsBudgetModalOpen(false) }} data={data} />)}
    </div >
  )


}

export default HeroSection