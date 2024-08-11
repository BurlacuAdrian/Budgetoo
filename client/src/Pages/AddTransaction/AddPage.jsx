import { useLocation, useNavigate } from "react-router-dom"
import { formatCurrency, formatNumberNoCurrency, getSVGForCategory } from "../../JS/Utils"
import { useEffect, useState } from "react"
import { useDataContext } from "../Wrappers/DataContext"
import { defaultCategories } from "../../JS/DefaultData"
import ButtonDarkOnWhite from "../../Components/ButtonDarkOnWhite"
import Swal from "sweetalert2"
import axiosInstance from "../../JS/axiosInstance"
import ToggleButton from "../../Components/ToggleButton"

const AddPage = () => {

  const navigate = useNavigate()
  const location = useLocation()

  const handleCancelButton = () => {
    // navigate('/home')
    navigate(-1)
  }

  const dataContext = useDataContext()
  if (!dataContext) {
    return <div>Loading...</div>; // TODO some other fallback UI
  }
  const { data, setData } = dataContext
  const [categories, setCategories] = useState(Object.keys(data.expenses) || defaultCategories)

  useEffect(() => {
    setCategories(Object.keys(data.expenses))
  }, [data])


  const [editableItem, setEditableItem] = useState(location.state || {})

  const [expenseName, setExpenseName] = useState(() => {
    if (editableItem) {
      if (editableItem.expenseName !== undefined) {
        return editableItem.expenseName;
      }
      if (Array.isArray(editableItem.income) && editableItem.income.length > 0) {
        return editableItem.income[0];
      }
    }
    return '';
  });
  
  
  const [amount, setAmount] = useState(() => {
    if (editableItem) {
      if (editableItem.amount !== undefined) {
        return editableItem.amount;
      }
      if (Array.isArray(editableItem.income) && editableItem.income.length > 1) {
        return editableItem.income[1];
      }
    }
    return '';
  });
  
  const [currency, setCurrency] = useState(() => {
    if (editableItem) {
      if (editableItem.currency !== undefined) {
        return editableItem.currency;
      }
      if (Array.isArray(editableItem.income) && editableItem.income.length > 2) {
        return editableItem.income[2];
      }
    }
    return 'EUR';
  });
  
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (editableItem && editableItem.category !== undefined) {
      return editableItem.category;
    }
    if (Array.isArray(categories) && categories.length > 0) {
      return categories[0];
    }
    return null; 
  });

  const index = editableItem?.index || 0
  const [isEditing, setIsEditing] = useState(Boolean(location.state?.editing));
  const [transactionType, setTransactionType] = useState(location?.state?.type||'Expenses')

  const [active, setActive] = useState(() => {
    return transactionType || 'Expenses';
  });  

  const confirmExpense = async () => {
    const success = await data.API.saveExpenses([expenseName, amount, currency], isEditing, index, selectedCategory)

    if(!success){
      Swal.fire('Failed to add transaction', '', 'error')
    }

    navigate(-1)
  }

  const confirmIncome = async () => {
    const success = await data.API.saveIncome([expenseName, amount, currency], isEditing, index)

    if(!success){
      Swal.fire('Failed to add transaction', '', 'error')
    }

    navigate(-1)

  }

  const confirmTransaction = async () => {
    if (expenseName == '') {
      Swal.fire('Missing name for transaction')
      return
    }
    if (amount == '') {
      Swal.fire('Missing amount for transaction')
      return
    }

    if (active === 'Expenses') {
      console.log("confirmed expenses")
      confirmExpense()
      return
    }

    //Income
    console.log("confirmed income")
    confirmIncome()
  }

  const handleDeleteButton = () => {
    Swal.fire({
      title: "Are you sure you want to delete this transaction?",
      showDenyButton: true,
      confirmButtonText: `Keep`,
      denyButtonText: `Delete`,
      customClass: {
        denyButton: 'swal2-button swal2-red-button'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Action when confirmed
      } else if (result.isDenied) {
        deleteTransaction();
      }
    });

  }

  const deleteExpense = async () => {
    const newExpenses = { ...data.expenses }

    newExpenses[selectedCategory].splice(index, 1)

    const newData = {
      ...data,
      expenses: newExpenses
    }

    const response = await axiosInstance.put(`/transactions`, newData)
    if (response.status != 200) {
      Swal.fire('Failed to delete transaction', '', 'error')
      // navigate('/home')
      navigate(-1)
      return
    }

    setData(newData)

    // navigate('/home')
    navigate(-1)
  }

  const deleteIncome = async () => {
    const newIncome = [ ...data.income ]

    newIncome.splice(index, 1)

    const newData = {
      ...data,
      income: newIncome
    }

    const response = await axiosInstance.put(`/transactions`, newData)
    if (response.status != 200) {
      Swal.fire('Failed to delete transaction', '', 'error')
      // navigate('/home')
      navigate(-1)
      return
    }

    setData(newData)

    // navigate('/home')
    navigate(-1)
  }

  const deleteTransaction = async () => {

    if(transactionType == 'Expenses'){
      deleteExpense()
      return
    }

    deleteIncome()
    
  }

  return (
    <div className='bg-primaryBudgetoo h-[100dvh] w-[100dvw] flex flex-col'>
      <div className="flex-grow"></div>
      <div className='bg-white w-full h-[90%] mt-auto rounded-t-[4rem] flex flex-col items-center pt-6 px-8'>

        <div className="relative w-full flex items-start" onClick={handleCancelButton}>
          <img src='./cancel.svg' className="size-8 inline " />
          <span className="absolute w-full text-center font-bold text-xl">Add transaction</span>
        </div>

        <ToggleButton comparandBase={active} leftComparand={'Expenses'} rightComparand={'Income'} leftText='Expenses' rightText='Income' leftClickHandler={() => setActive('Expenses')} rightClickHandler={() => setActive('Income')} />

        {/* <div className="grid grid-cols-3 w-full px-6 mt-8">
          <span className="text-2xl bg-primaryBudgetoo w-fit px-2 rounded-3xl text-white">{currencyName}</span>
          <span className="text-2xl">{formatNumberNoCurrency(transactionTotal)}</span>
        </div> */}

        <div className="grid grid-cols-4 p-2 gap-8 mt-8">

          {active === 'Expenses' && (
            <img src={getSVGForCategory(selectedCategory)} className="col-span-1"></img>

          )}

          {active === 'Expenses' && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded col-span-3"
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          )}


          <img src={'./text.svg'} className="col-span-1"></img>
          <input className="col-span-3 flex items-center text-[1.5rem] border-b-2 border-gray-400 focus:outline-none focus:border-blue-500" placeholder={active == 'Expenses' ? "Expense name" : 'Income source'} value={expenseName} onChange={(e) => setExpenseName(e.target.value)} />


          <img src={'./check.svg'} className="col-span-1"></img>
          <input className="col-span-3 flex items-center text-[1.5rem] border-b-2 border-gray-400 focus:outline-none focus:border-blue-500" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />

          <img src={'./dollar.svg'} className="col-span-1"></img>
          {/* <input className="col-span-3 flex items-center text-[1.5rem] border-b-2 border-gray-400 focus:outline-none focus:border-blue-500" /> */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-3 py-2 border rounded col-span-3"
          >
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="RON">RON</option>
          </select>
        </div>

        <ButtonDarkOnWhite text="Confirm" className="mt-4 w-2/3" onClickHandler={confirmTransaction} />
        <ButtonDarkOnWhite text="Delete" className="mt-4 w-2/3 bg-red-500" onClickHandler={handleDeleteButton} />
      </div>
    </div>
  )
}

export default AddPage