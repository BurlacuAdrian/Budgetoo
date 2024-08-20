import { getSVGForCategory } from "../../JS/Utils"
import ButtonDarkOnWhite from "../../Components/ButtonDarkOnWhite"
import ToggleButton from "../../Components/ToggleButton"

const AddPageDesktop = ({ data, confirmTransaction, active, setActive, selectedCategory, setSelectedCategory, currency, setCurrency, amount, setAmount, expenseName, setExpenseName, categories, handleCancelButton, selectedYear, displayMonth, handleMonthYearChange }) => {

  return (
    <div className='w-full h-[80%] flex'>

      <div className='h-full w-[10%] min-w-[10%]'></div>

      <div className='flex flex-col w-[90%] max-w-[90%] h-full p-20'>

        <div className="relative w-full flex items-end" onClick={handleCancelButton}>
          <span className="absolute w-full text-center font-bold text-xl">Add transaction</span>
          <img src='./cancel.svg' className="size-12 inline " />
        </div>

        <div className="w-full flex justify-center">
          <ToggleButton comparandBase={active} leftComparand={'Expenses'} rightComparand={'Income'} leftText='Expenses' rightText='Income' leftClickHandler={() => setActive('Expenses')} rightClickHandler={() => setActive('Income')} />
        </div>


        <div className="grid grid-cols-2 gap-8 mt-16 w-full p-20">

          <div className="grid grid-cols-4 w-[70%] gap-12">
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


          <div className="flex flex-col justify-center gap-20 items-center">
          <input type='month' value={`${selectedYear}-${displayMonth}`} onChange={handleMonthYearChange} className='text-[1.5rem] my-2' />
            <ButtonDarkOnWhite text="Confirm" className="mt-4 w-2/3" onClickHandler={confirmTransaction} />
            <ButtonDarkOnWhite text="Cancel" className="mt-4 w-2/3" onClickHandler={handleCancelButton} />
          </div>


        </div>


      </div>
    </div>
  )

}

export default AddPageDesktop