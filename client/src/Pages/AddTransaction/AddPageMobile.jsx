import { useNavigate } from "react-router-dom"
import { getSVGForCategory } from "../../JS/Utils"
import ButtonDarkOnWhite from "../../Components/ButtonDarkOnWhite"
import Swal from "sweetalert2"
import ToggleButton from "../../Components/ToggleButton"
const AddPageMobile = ({data, confirmTransaction, active, setActive, transactionType, isEditing, indexForEditing, selectedCategory, setSelectedCategory, currency, setCurrency, amount, setAmount, expenseName, setExpenseName, categories, handleCancelButton}) => {

  const navigate = useNavigate()

  const deleteExpense = async () => {
    const success = await data.API.deleteExpenseByCategoryAndIndex(selectedCategory, indexForEditing)

    if (success === false) {
      Swal.fire('Failed to delete transaction', '', 'error')
      navigate(-1)
      return
    }

    setData(newData)
    navigate(-1)
  }

  const deleteIncome = async () => {
    const success = await data.API.deleteIncomeByIndex(indexForEditing)

    if (success === false) {
      Swal.fire('Failed to delete transaction', '', 'error')
      navigate(-1)
      return
    }

    setData(newData)
    navigate(-1)
  }

  const deleteTransaction = async () => {

    if (transactionType == 'Expenses') {
      deleteExpense()
      return
    }

    deleteIncome()

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
      if (result.isDenied) {
        deleteTransaction();
      }
    });

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
        {isEditing == true && <ButtonDarkOnWhite text="Delete" className="mt-4 w-2/3 bg-red-500" onClickHandler={handleDeleteButton} />}
      </div>
    </div>
  )

}

export default AddPageMobile