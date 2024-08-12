import { useState } from 'react'
import { convertAndCalculatePercentageOfTotal, formatCurrency, formatNumberNoCurrency, getSVGForCategory, sumAndConvertItems } from '../../JS/Utils.js'
import CircularProgressBar from './CircularProgressBar'
import { useNavigate } from 'react-router-dom'
import { useLocation } from "react-router-dom";
import ToggleButton from "../../Components/ToggleButton"
import { useDataContext } from '../Wrappers/DataContext.jsx';
import ButtonDarkOnWhite from '../../Components/ButtonDarkOnWhite.jsx';
import { defaultExpenses } from '../../JS/DefaultData.js';

const getColorForCategory = (category) => {
  switch (category) {
    case 'Housing':
      return 'text-blue-400'
    case 'Transportation':
      return 'text-slate-600'
    case 'Food':
      return 'text-amber-900'
    case 'Health':
      return 'text-red-500'
    default:
      return 'text-primaryBudgetoo'
  }
}

//TODO handle different currencies
const sumUpItems = (items) => {
  var sum = 0
  items.forEach(item => {
    sum += (isNaN(+item[1]) ? 0 : +item[1])
  })
  return sum
}

const countTransactions = (items) => {
  return items.length
}


const TransactionsContainer = ({ currencyName, monthlyBudget }) => {

  const navigate = useNavigate()
  const [active, setActive] = useState('Expenses');
  const dataContext = useDataContext()
  if (!dataContext) {
    return <div>Loading transactions...</div>; // TODO some other fallback UI
  }
  const { data, setData } = dataContext



  const handleGenerateTemplate = () => {
    setData(oldData => ({ ...oldData, expenses: defaultExpenses }))
  }

  const handleCategoryClick = (categoryName, items) => {
    // navigate(`/view`, {state : {category, items, budget: data.budget}})
    navigate(`/view`, { state: { category: categoryName, type:'Expenses', editing: true } })
  }

  const handleIncomeClick = (income, index) => {
    navigate(`/add`, { state: { income, type:'Income', editing: true, index} })
  }



  return (
    <div className='bg-white w-full h-[65%] rounded-t-[4rem] flex flex-col items-center'>

      <ToggleButton comparandBase={active} leftComparand={'Expenses'} rightComparand={'Income'} leftText='Expenses' rightText='Income' leftClickHandler={() => setActive('Expenses')} rightClickHandler={() => setActive('Income')} />

      <div className='h-[60%] w-full mt-8 px-3 grid gap-4 overflow-y-scroll'>
        {active === 'Expenses' && (Object.entries(data.expenses).length == 0 ?
          (<div className='w-full h-fit flex items-center justify-around'>
            <span>No expenses tracked this month. </span>
            <button className='bg-accentBudgetoo text-white p-2 rounded-3xl' onClick={handleGenerateTemplate}>Generate template?</button>
          </div>) :

          Object.entries(data.expenses).map(([category, items]) => {
            const imgSrc = getSVGForCategory(category);
            const totalAmount = formatCurrency(sumAndConvertItems(items, data.mainCurrency, data.currencyTable), data.mainCurrency);
            // const percentageOfTotal = calculatePercentageOfTotal(items, data.expenses);
            const percentageOfTotal = convertAndCalculatePercentageOfTotal(items, data.mainCurrency, data.currencyTable, data.totalSpent);
            const transactionCount = countTransactions(items);

            return (
              <div key={category} className="grid grid-cols-12 mx-4 mr-8" onClick={() => { handleCategoryClick(category, items) }}>
                <div className='col-span-3 mr-4'>
                  <CircularProgressBar percentage={percentageOfTotal} imgSrc={imgSrc} customColor={getColorForCategory(category)} />
                </div>
                <div className='col-span-9 grid grid-rows-2 py-4'>
                  <div className='flex justify-between'>
                    <span>{category}</span>
                    <span>{totalAmount}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-400'>{`${percentageOfTotal} % of total`}</span>
                    <span className='text-gray-400'>{`${transactionCount} transactions`}</span>
                  </div>
                </div>
              </div>
            );
          }))}

        {active === 'Income' && (data.income.length == 0 ?
          (<div className='w-full h-fit flex items-center justify-around'>
            <span>No income tracked this month. </span>
            {/* TODO */}
            <button className='bg-accentBudgetoo text-white p-2 rounded-3xl' onClick={handleGenerateTemplate}>Generate template?</button>
          </div>) :

          (<div className="mx-4 mr-8">
            {data.income.map(([incomeName, amount, currency], index) => {
              return (
                <div key={`${incomeName}${index}`} className="grid grid-cols-12 mt-6 items-center" onClick={() => { handleIncomeClick([incomeName, amount, currency], index) }}>
                  <span className='text-2xl col-span-7'>{incomeName}</span>
                  <span className='col-span-2 rounded-3xl bg-primaryBudgetoo py-2 px-2 mr-4 '>{currency}</span>
                  <span className='col-span-3 text-right'>{formatNumberNoCurrency(amount)}</span>


                </div>
              );
            })
            }
          </div>)
        )
        }


      </div>
    </div>
  )
}

export default TransactionsContainer