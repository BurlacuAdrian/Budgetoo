import { useNavigate, useSearchParams } from "react-router-dom"
import useDeviceType from "../../Hooks/useDeviceType"
import CurrencyTable from "./CurrencyTable"
import { useState } from "react"
import { useDataContext } from "../Wrappers/DataContext"

const PaymentsPage = () => {

  const navigate = useNavigate()
  const handleCancelButton = () => {
    navigate('/home')
  }

  const device = useDeviceType()

  var dataContext = useDataContext()

  if (!dataContext) {
    console.log(dataContext)
    return <div>Loading profile page...</div>; // TODO some other fallback UI
  }
  const { data, setData } = dataContext

  const currencyTable = data.currencyTable

  const [firstInput, setFirstInput] = useState('')
  const [secondInput, setSecondInput] = useState('')
  const [firstCurrency, setFirstCurrency] = useState('EUR')
  const [secondCurrency, setSecondCurrency] = useState('RON')


  const handleGlobalChange = (firstInputChanged = false, secondInputChanged = false, firstCurrencyChanged = false, secondCurrencyChanged = false, value) => {
    if (firstCurrencyChanged === true) {
      setFirstCurrency(value)
      const newValue = currencyTable[value][secondCurrency] * firstInput || firstInput
      setSecondInput(newValue)
    }
    if (secondCurrencyChanged === true) {
      setSecondCurrency(value)
      const newValue = currencyTable[value][firstCurrency] * secondInput || secondInput
      setFirstInput(newValue)
    }
    if (firstInputChanged === true) {
      setFirstInput(value)
      const newValue = currencyTable[firstCurrency][secondCurrency] * value || value
      setSecondInput(newValue)
    }
    if (secondInputChanged === true) {
      setSecondInput(value)
      const newValue = currencyTable[secondCurrency][firstCurrency] * value || value
      setFirstInput(newValue)
    }
  }

  if (device.type == 'mobile') {
    return (
      <div className='bg-primaryBudgetoo h-[100dvh] w-[100dvw]'>
        <div className="h-[3rem] max-h-[3rem]"></div>
        <div className='bg-white w-full h-full mt-auto rounded-t-[4rem] flex flex-col items-center pt-6 px-8'>

          <div className="relative w-full flex items-start" onClick={handleCancelButton}>
            <img src='./cancel.svg' className="size-8 inline " />
            <span className="absolute w-full text-center font-bold text-xl">Exchange</span>
          </div>

          <div className="text-center my-4"><strong>Todays</strong>'s exchange rates, provided via the National Bank of Romania's API</div>
          <CurrencyTable currencyTable={currencyTable} />

          <div className=" mt-8 grid grid-cols-5 w-full gap-4">
            <div className="col-span-5 text-center">Convert</div>
            <input className="col-span-3 bg-gray-300 rounded-xl h-10 px-4" type="number" value={firstInput} onChange={(e) => handleGlobalChange(true, false, false, false, e.target.value)}></input>
            <select className="col-span-2 rounded-xl px-2" value={firstCurrency} onChange={(e) => handleGlobalChange(false, false, true, false, e.target.value)}>
              {Object.keys(currencyTable).map((key, index) => {
                return (
                  <option value={key}>{key}</option>
                )
              })}
            </select>

            <img src="./arrows.svg" className="col-span-5 w-16 mx-auto" />

            <select className="col-span-2 rounded-xl px-2" value={secondCurrency} onChange={(e) => handleGlobalChange(false, false, false, true, e.target.value)}>
              {Object.keys(currencyTable).map((key, index) => {
                return (
                  <option value={key}>{key}</option>
                )
              })}
            </select>
            <input className="col-span-3 bg-gray-300 rounded-xl h-10 px-4" type="number" value={secondInput} onChange={(e) => handleGlobalChange(false, true, false, false, e.target.value)}></input>
          </div>


        </div>
      </div>
    )
  }
  return (
    <div className="w-full h-[100vh] flex">
      <div className="h-full w-[10%] min-w-[10%]" />
      <div className="w-[90%] max-w-[90%] h-full grid grid-rows-1 grid-cols-2 gap-10 px-10 align-middle">
        <div className="flex flex-col items-center justify-center">
          <div className="text-center my-4">
            <strong>Today's</strong> exchange rates, provided via the National Bank of Romania's API
          </div>
          <CurrencyTable currencyTable={currencyTable} />
        </div>
        <div className="bg-primaryBudgetoo rounded-3xl shadow-2xl grid grid-cols-5 items-center justify-center gap-10 py-60 px-32 my-40">
          <div className="col-span-5 text-center text-3xl">Convert</div>
          <input className="col-span-3 rounded-xl h-10 px-4" type="number" value={firstInput} onChange={(e) => handleGlobalChange(true, false, false, false, e.target.value)}></input>
          <select className="col-span-2 rounded-xl px-2 h-10" value={firstCurrency} onChange={(e) => handleGlobalChange(false, false, true, false, e.target.value)}>
            {Object.keys(currencyTable).map((key, index) => {
              return (
                <option value={key}>{key}</option>
              )
            })}
          </select>

          <img src="./arrows.svg" className="col-span-5 w-16 mx-auto" />

          <select className="col-span-2 rounded-xl px-2 h-10" value={secondCurrency} onChange={(e) => handleGlobalChange(false, false, false, true, e.target.value)}>
            {Object.keys(currencyTable).map((key, index) => {
              return (
                <option value={key}>{key}</option>
              )
            })}
          </select>
          <input className="col-span-3 rounded-xl h-10 px-4" type="number" value={secondInput} onChange={(e) => handleGlobalChange(false, true, false, false, e.target.value)}></input>
        </div>
      </div>
    </div>
  );
}

export default PaymentsPage