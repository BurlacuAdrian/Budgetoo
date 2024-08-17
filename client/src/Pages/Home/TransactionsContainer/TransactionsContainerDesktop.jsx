import { useEffect, useState } from 'react'
import { convertAndCalculatePercentageOfTotal, formatCurrency, formatNumberNoCurrency, getSVGForCategory, sumAndConvertItems, getTransactionsCaption } from '../../../JS/Utils.js'
import CircularProgressBar from '../CircularProgressBar.jsx'
import Swal from 'sweetalert2';

const TransactionsContainerDesktop = ({data, countTransactions, getColorForCategory, percentageOfBudget, noOfTransactions,  handleGenerateTemplate, desktopViewedCategory, setDesktopViewedCategory}) => {

  /* Income Handling Start */
  const [desktopIncomeIndex, setDesktopIncomeIndex] = useState(null)
  const [desktopSelectedIncome, setDesktopSelectedIncome] = useState(null)

  const handleDesktopIncomeClick = ([incomeName, amount, currency], index) => {
    setDesktopIncomeIndex(index)
    setDesktopSelectedIncome([incomeName, amount, currency])
  }

  const handleDesktopIncomeSave = async ([incomeName, amount, currency], index) => {
    console.log([incomeName, amount, currency])
    const result = await data.API.saveIncome([incomeName, amount, currency], true, index)
    handleIncomeCancel()
  }

  const handleDesktopIncomeDelete = async (index) => {
    const item = data.income[index]; // Replace with your actual income item retrieval logic
    
    const result = await Swal.fire({
      title: `Do you want to delete income '${item[0]}' for ${item[2]} ${item[1]}?`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      customClass: { 
        confirmButton: 'swal2-button swal2-red-button', 
        cancelButton: 'swal2-button'
      }
    });
  
    if (!result.isConfirmed) {
      return; // Exit if the user cancels the action
    }
  
    const deleteResult = await data.API.deleteIncomeByIndex(index);
  
    if (!deleteResult) {
      Swal.fire('Failed to delete transaction', '', 'error');
    }
  
    handleIncomeCancel();
  };

  const handleIncomeCancel = () => {
    setDesktopIncomeIndex(null)
  }

  /* Income Handling End*/

  /* Expenses Handling Start */

  const [desktopSelectedExpense, setDesktopSelectedExpense] = useState(null)
  const [desktopSelectedExpenseIndex, setDesktopSelectedExpenseIndex] = useState(null)


  const handleExpenseClick = (element, index) => {

    console.log(desktopSelectedExpense)
    //Cancel action if one element is already selected
    if (desktopSelectedExpense) {
      return
    }

    setDesktopSelectedExpense(element)
    setDesktopSelectedExpenseIndex(index)
  }

  const handleDesktopExpenseSave = async ([expenseName, amount, currency], index, selectedCategory) => {
    const result = await data.API.saveExpenses([expenseName, amount, currency], true, index, selectedCategory)
    // handleExpenseClick([expenseName, amount, currency], index, true)
    handleDesktopExpenseCancel()
  }

  const handleDesktopExpenseDelete = async (category, index) => {
    const item = category.items[index];
    const result = await Swal.fire({
      title: `Do you want to delete '${item[0]}' for ${item[2]} ${item[1]}?`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      customClass: { 
        confirmButton: 'swal2-button swal2-red-button', 
        cancelButton: 'swal2-button'
      }
    });

    if (!result.isConfirmed) {
      return; // Exit if the user cancels the action
    }

    const deleteResult = await data.API.deleteExpenseByCategoryAndIndex(category.name, index);

    if (deleteResult === false) {
      Swal.fire('Failed to delete transaction', '', 'error');
    }

    handleDesktopExpenseCancel();
  };

  const handleDesktopExpenseCancel = () => {
    setDesktopSelectedExpense(null)
    setDesktopSelectedExpenseIndex(null)
  }

  const resetDesktopViewedCategory = () => {
    setDesktopViewedCategory({ name: null, items: [] })
  }

  const handleCategoryClick = (categoryName, items) => {
    setDesktopViewedCategory({ name: categoryName, items })
  }

  /* Expenses Handling End */

  return (
    <div className='w-full h-[80%] flex'>

      <div className='h-full w-[10%] min-w-[10%]'></div>

      <div className='flex flex-col w-[90%] max-w-[90%] h-full'>
        <div className='h-[30%] px-10 py-12'>
          <span className='text-2xl font-bold'>Income</span>
          <div className='mt-10 flex space-x-8 overflow-x-auto p-4'>
            {(data.income.length == 0 &&
              (<div className='w-1/3 h-fit flex items-center justify-around'>
                <span>No income tracked this month. </span>
                <button className='bg-accentBudgetoo text-white p-2 rounded-3xl' onClick={handleGenerateTemplate}>Generate template?</button>
              </div>))}
            {data.income.map(([incomeName, amount, currency], index) => {
              return ((desktopIncomeIndex != null && desktopIncomeIndex == index) ? (
                <div key={`${incomeName}${index}`} className="bg-white rounded-xl w-1/4 drop-shadow-lg h-40 p-4 grid grid-cols-4 gap-4">

                  <div className='col-span-3 grid grid-cols-3 gap-2'>
                    <input className='text-2xl col-span-3 w-fit mr-6 bg-gray-100 rounded-xl' value={desktopSelectedIncome[0]} onChange={(e) => { setDesktopSelectedIncome(oldValue => { const newValue = [...oldValue]; newValue[0] = e.target.value; return newValue; }) }}></input>
                    <select
                      value={desktopSelectedIncome[2]}
                      onChange={(e) => { setDesktopSelectedIncome(oldValue => { const newValue = [...oldValue]; newValue[2] = e.target.value; return newValue; }) }}
                      className="col-span-1 rounded-3xl bg-primaryBudgetoo py-2 px-2 mr-4 "
                    >
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                      <option value="RON">RON</option>
                    </select>
                    <input className='col-span-2 text-right text-2xl bg-gray-100 rounded-xl' value={desktopSelectedIncome[1]} onChange={(e) => { setDesktopSelectedIncome(oldValue => { const newValue = [...oldValue]; newValue[1] = e.target.value; return newValue; }) }}></input>
                  </div>

                  <div className=''>
                    <button className='mx-4 bg-primaryBudgetoo py-3 px-5 rounded-xl' onClick={() => handleDesktopIncomeSave([desktopSelectedIncome[0], desktopSelectedIncome[1], desktopSelectedIncome[2]], index)}>Save</button>
                    <button className='mt-2 mx-4 bg-red-400 p-1 px-3 rounded-xl' onClick={(e) => handleDesktopIncomeDelete(index)}>Delete</button>
                    <button className='mt-2 mx-4 bg-gray-400 p-1 px-3 rounded-xl' onClick={(e) => handleIncomeCancel(e)}>Cancel</button>
                  </div>

                </div>
              ) :

                (
                  <div key={`${incomeName}${index}`} className="bg-white rounded-xl w-1/6 drop-shadow-lg h-32 p-4 grid grid-rows-2 gap-4" onClick={() => { handleDesktopIncomeClick([incomeName, amount, currency], index) }}>
                    <div className='text-2xl col-span-7'>{incomeName}</div>
                    <div>
                      <span className='col-span-2 rounded-3xl bg-primaryBudgetoo py-2 px-2 mr-4 '>{currency}</span>
                      <span className='col-span-3 text-right text-2xl'>{formatNumberNoCurrency(amount)}</span>
                    </div>

                  </div>
                )
              )
            }
            )}

          </div>
        </div>
        {desktopViewedCategory.name == null && (
          <div className='h-[70%] px-10 py-12'>

            <span className='text-2xl font-bold'>Expenses</span>
            <div className='mt-10 p-4'>
              {Object.entries(data.expenses).length === 0 && (
                <div className='w-full h-fit flex items-center justify-around'>
                  <span>No expenses tracked this month. </span>
                  <button
                    className='bg-accentBudgetoo text-white p-2 rounded-3xl'
                    onClick={handleGenerateTemplate}
                  >
                    Generate template?
                  </button>
                </div>
              )}

              <div className='grid grid-cols-3 gap-4'>
                {Object.entries(data.expenses).map(([category, items]) => {
                  const imgSrc = getSVGForCategory(category);
                  const totalAmount = formatCurrency(
                    sumAndConvertItems(items, data.mainCurrency, data.currencyTable),
                    data.mainCurrency
                  );
                  const percentageOfTotal = convertAndCalculatePercentageOfTotal(
                    items,
                    data.mainCurrency,
                    data.currencyTable,
                    data.totalSpent
                  );
                  const transactionCount = countTransactions(items);

                  return (
                    <div
                      key={category}
                      className='bg-white rounded-xl drop-shadow-lg h-28'
                      onClick={() => {
                        handleCategoryClick(category, items);
                      }}
                    >
                      <div className='grid grid-cols-12 h-full mx-4 mr-8'>
                        <div className='col-span-3 mr-4'>
                          <CircularProgressBar
                            percentage={percentageOfTotal}
                            imgSrc={imgSrc}
                            customColor={getColorForCategory(category)}
                          />
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
                    </div>
                  );
                })}
              </div>
            </div>

          </div>)
        }

        {desktopViewedCategory.name != null && (
          <div className='h-[70%] px-10 py-12'>

            <span className='text-2xl font-bold text-gray-500' onClick={resetDesktopViewedCategory}>{`Expenses > `}</span>
            <span className='text-2xl font-bold'>{`${desktopViewedCategory.name}`}</span>
            <span className="text-gray-400 mx-6">{`${percentageOfBudget}% of budget`}</span>
            <span className="text-gray-400">{`${getTransactionsCaption(noOfTransactions)}`}</span>
            <div className='mt-10 p-4'>

              <div className="w-1/2 p-4 mt-4 grid gap-4 ">
                {desktopViewedCategory && desktopViewedCategory?.items?.map((element, index) => {
                  if (desktopSelectedExpenseIndex === index) {
                    return (
                      <div key={index} className="flex justify-between w-full">
                        <input className="text-2xl rounded-xl" value={desktopSelectedExpense[0]} onChange={(e) => setDesktopSelectedExpense(oldValue => { const newValue = [...oldValue]; newValue[0] = e.target.value; return newValue; })} />
                        <select
                          value={desktopSelectedExpense[2]}
                          onChange={(e) => setDesktopSelectedExpense(oldValue => { const newValue = [...oldValue]; newValue[2] = e.target.value; return newValue; })}
                          className="w-1/3 px-3 py-2 border rounded-xl "
                        >
                          <option value="EUR">EUR</option>
                          <option value="USD">USD</option>
                          <option value="RON">RON</option>
                        </select>
                        <input className="text-2xl text-center w-1/3 rounded-xl" value={desktopSelectedExpense[1]} onChange={(e) => setDesktopSelectedExpense(oldValue => { const newValue = [...oldValue]; newValue[1] = e.target.value; return newValue; })} />
                        <button className='mx-4 bg-primaryBudgetoo py-3 px-5 rounded-xl' onClick={() => handleDesktopExpenseSave([desktopSelectedExpense[0], desktopSelectedExpense[1], desktopSelectedExpense[2]], index, desktopViewedCategory.name)}>Save</button>
                        <button className='mx-4 bg-red-400 p-3 rounded-xl' onClick={() => handleDesktopExpenseDelete(desktopViewedCategory, index)}>Delete</button>
                        <button className='mx-4 bg-gray-400 p-3 rounded-xl' onClick={() => handleDesktopExpenseCancel()}>Cancel</button>
                      </div>
                    )
                  }
                  return (
                    <div key={index} className="flex justify-between w-full" onClick={() => handleExpenseClick(element, index)}>
                      <span className="text-2xl">{element[0]}</span>
                      <span className="text-2xl">{formatCurrency(element[1], element[2])}</span>
                    </div>
                  )

                })}
              </div>
            </div>

          </div>)
        }

      </div>
    </div>
  )
}

export default TransactionsContainerDesktop