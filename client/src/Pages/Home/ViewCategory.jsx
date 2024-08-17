import { useLocation, useNavigate } from "react-router-dom"
import { convertAndCalculatePercentageOfTotal, formatCurrency, getTransactionsCaption } from "../../JS/Utils.js"
import { useEffect, useState } from "react"
import { useDataContext } from "../Wrappers/DataContext.jsx"

const ViewCategory = () => {

  const navigate = useNavigate()

  const handleCancelButton = () => {
    navigate(-1)
  }

  //TODO handle budget and percentage of it

  const location = useLocation()

  const dataContext = useDataContext()
  if (!dataContext) {
    return <div>Loading...</div>; // TODO some other fallback UI
  }
  const { data, setData } = dataContext
  
  const [shownCategory, setShownCategory] = useState(location.state.category || {})
  const [categoryItems, setCategoryItems] = useState(data.expenses[shownCategory])
  
  const [percentageOfBudget, setPercentageOfBudget] = useState(convertAndCalculatePercentageOfTotal(categoryItems, data.mainCurrency, data.currencyTable, data.budget))
  const [noOfTransactions, setNoOfTransactions] = useState(categoryItems.length || 0)
  


  useEffect(() => {
    setNoOfTransactions(categoryItems.length || 0)
    setCategoryItems(data.expenses[shownCategory])
  }, [shownCategory])
  

  const handleItemClick = (element, index) => {
    navigate(`/add`, {
      state: {
        expenseName: element[0],
        amount: element[1],
        currency: element[2],
        index,
        category: shownCategory,
        editing: true
      }
    })
  }


  return (
    <div className='bg-primaryBudgetoo h-[100dvh] w-[100dvw] flex flex-col'>
      <div className="flex-grow"></div>
      <div className='bg-white w-full h-[90%] mt-auto rounded-t-[4rem] flex flex-col items-center pt-6 px-8'>

        <div className="relative w-full flex items-start" onClick={handleCancelButton}>
          <img src='./cancel.svg' className="size-8 inline " />
          <span className="absolute w-full text-center font-bold text-xl">{`${shownCategory} expenses`}</span>
        </div>

        <div className="w-full flex justify-around mt-6">
          <span className="text-gray-400">{`${percentageOfBudget}% of budget`}</span>
          <span className="text-gray-400">{`${getTransactionsCaption(noOfTransactions)}`}</span>
        </div>

        <div className="w-full p-4 mt-4 grid gap-4">
          {categoryItems.map((element, index) => {

            return (
              <div key={index} className="flex justify-between w-full" onClick={() => handleItemClick(element, index)}>
                <span className="text-2xl">{element[0]}</span>
                <span className="text-2xl">{formatCurrency(element[1], element[2])}</span>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}

export default ViewCategory