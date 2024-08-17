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
  const [categories, setCategories] = useState(Object.keys(data.expenses) || defaultCategories)

  useEffect(() => {
    setCategories(Object.keys(data.expenses))
  }, [data])


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
    const success = await data.API.saveExpenses([expenseName, amount, currency], isEditing, indexForEditing, selectedCategory)

    if (!success) {
      Swal.fire('Failed to add transaction', '', 'error')
    }

    navigate(-1)
  }

  const confirmIncome = async () => {
    const success = await data.API.saveIncome([expenseName, amount, currency], isEditing, indexForEditing)

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

  if (device.type == 'mobile') {
    return (<AddPageMobile data={data} confirmTransaction={confirmTransaction} active={active} setActive={setActive} transactionType={transactionType} isEditing={isEditing} indexForEditing={indexForEditing} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} currency={currency} setCurrency={setCurrency} amount={amount} setAmount={setAmount} expenseName={expenseName} setExpenseName={setExpenseName} categories={categories} handleCancelButton={handleCancelButton}/>)
  }

  return (<AddPageDesktop data={data} confirmTransaction={confirmTransaction} active={active} setActive={setActive} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} currency={currency} setCurrency={setCurrency} amount={amount} setAmount={setAmount} expenseName={expenseName} setExpenseName={setExpenseName} categories={categories} handleCancelButton={handleCancelButton}/>)


}

export default AddPage