import { useEffect, useState } from 'react'
import { convertAndCalculatePercentageOfTotal, formatCurrency, formatNumberNoCurrency, getSVGForCategory, sumAndConvertItems, getTransactionsCaption } from '../../../JS/Utils.js'
import CircularProgressBar from '../CircularProgressBar.jsx'
import { useNavigate } from 'react-router-dom'
import ToggleButton from "../../../Components/ToggleButton.jsx"

const TransactionsContainerMobile = ({ data, countTransactions, getColorForCategory, percentageOfBudget, noOfTransactions, handleGenerateTemplate, }) => {

  const [active, setActive] = useState('Expenses');

  const navigate = useNavigate()

  const handleIncomeClick = (income, index) => {
    navigate(`/add`, { state: { income, type: 'Income', editing: true, index } })
  }

  const handleCategoryClick = (categoryName, items) => {
    navigate(`/view`, { state: { category: categoryName, type: 'Expenses', editing: true } })
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
            const percentageOfTotal = convertAndCalculatePercentageOfTotal(items, data.mainCurrency, data.currencyTable, data.totalSpent);
            const transactionCount = countTransactions(items);

            return (
              <div key={category} className="grid grid-cols-12 mx-4 mr-8 max-h-[25%]" onClick={() => { handleCategoryClick(category, items) }}>
                <div className='col-span-3 mr-4 sm:w-24'>
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
            <button className='bg-accentBudgetoo text-white p-2 rounded-3xl' onClick={()=>handleGenerateTemplate(true)}>Generate template?</button>
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

            {data.incomeFromFamily &&
              Object.entries(data.incomeFromFamily).map(([id, incomes], index) => {
                const nickname = data.familyMembers[id]
                return (incomes.map(([incomeName, amount, currency]) => (
                  <div key={`${incomeName}${index}`} className="grid grid-cols-12 mt-6 items-center bg-emerald-100 px-2 rounded-2xl">
                    <span className='text-2xl col-span-7'>{`${nickname}'s ${incomeName}`}</span>
                    <span className='col-span-2 rounded-3xl bg-primaryBudgetoo py-2 px-2 mr-4 '>{currency}</span>
                    <span className='col-span-3 text-right'>{formatNumberNoCurrency(amount)}</span>

                  </div>
                ))
              )
            }
              )
            }
            
          </div>)
        )
        }


      </div>
    </div>
  )
}

export default TransactionsContainerMobile