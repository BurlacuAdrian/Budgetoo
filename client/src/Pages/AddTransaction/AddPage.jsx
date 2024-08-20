import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useDataContext } from "../Wrappers/DataContext"
import { defaultCategories } from "../../JS/DefaultData"
import Swal from "sweetalert2"
import useDeviceType from "../../Hooks/useDeviceType"
import AddPageDesktop from "./AddPageDesktop"
import AddPageMobile from "./AddPageMobile"

const AddPage = () => {

  const navigate = useNavigate()
  const location = useLocation()

  const handleCancelButton = () => {
    navigate(-1)
  }

  const dataContext = useDataContext()
  if (!dataContext) {
    return <div>Loading...</div>; // TODO some other fallback UI
  }
  const { data, setData } = dataContext
  const [categories, setCategories] = useState(defaultCategories)

  const [editableItem, setEditableItem] = useState(location.state || {})

  const [expenseName, setExpenseName] = useState(() => {
    if (!editableItem) {
      return ''
    }
    if (editableItem.expenseName !== undefined) {
      return editableItem.expenseName
    }
    if (Array.isArray(editableItem.income) && editableItem.income.length > 0) {
      return editableItem.income[0]
    }
  });


  const [amount, setAmount] = useState(() => {
    if (!editableItem) {
      return ''
    }
    if (editableItem.amount !== undefined) {
      return editableItem.amount
    }
    if (Array.isArray(editableItem.income) && editableItem.income.length > 1) {
      return editableItem.income[1]
    }
  });

  const [currency, setCurrency] = useState(() => {
    if (editableItem) {
      return 'EUR'
    }
    if (editableItem.currency !== undefined) {
      return editableItem.currency
    }
    if (Array.isArray(editableItem.income) && editableItem.income.length > 2) {
      return editableItem.income[2]
    }
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

  const indexForEditing = editableItem?.index || 0
  const isEditing = Boolean(location.state?.editing);
  const transactionType = location?.state?.type || 'Expenses'

  const [active, setActive] = useState(() => {
    return transactionType || 'Expenses';
  });

  const confirmExpense = async () => {
    var success = false
    if(selectedMonth == data.month && selectedYear == data.year){
      success = await data.API.saveExpenses([expenseName, amount, currency], isEditing, indexForEditing, selectedCategory)
    }else{
      success = await data.API.addExpense(selectedYear, selectedMonth, selectedCategory, expenseName, amount, currency)
    }

    if (!success) {
      Swal.fire('Failed to add transaction', '', 'error')
    }

    navigate(-1)
  }

  const confirmIncome = async () => {
    var success = false
    if(selectedMonth == data.month && selectedYear == data.year){
      success = await data.API.saveIncome([expenseName, amount, currency], isEditing, indexForEditing)
    }else{
      success = await data.API.addIncome(selectedYear, selectedMonth, expenseName, amount, currency)
    }

    if (!success) {
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

    confirmIncome()
  }

  const device = useDeviceType()

  const [selectedMonth, setSelectedMonth] = useState(data?.month);
  const [selectedYear, setSelectedYear] = useState(data?.year);

  const displayMonth = selectedMonth ? `${selectedMonth}`.padStart(2, '0') : 'MM';

  const handleMonthYearChange = (event) => {
    const [year, month] = event.target.value.split('-'); // Parse the year and month from the YYYY-MM format
    setSelectedMonth(Number(month)); // Convert month to a number
    setSelectedYear(Number(year));   // Convert year to a number

  };

  const commonProps = {
    data,
    confirmTransaction,
    active,
    setActive,
    selectedCategory,
    setSelectedCategory,
    currency,
    setCurrency,
    amount,
    setAmount,
    expenseName,
    setExpenseName,
    categories,
    handleCancelButton,
    selectedYear,
    displayMonth,
    handleMonthYearChange,
  };
  
  if (device.type === 'mobile') {
    return (
      <AddPageMobile
        {...commonProps}
        transactionType={transactionType}
        isEditing={isEditing}
        indexForEditing={indexForEditing}
      />
    )
  }
  
  return <AddPageDesktop {...commonProps} />

}
  

export default AddPage