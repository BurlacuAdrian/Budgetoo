import { useLocation, useNavigate } from "react-router-dom";
import { convertAndCalculatePercentageOfTotal, formatCurrency, getTransactionsCaption } from "../../JS/Utils.js";
import { useEffect, useState } from "react";
import { useDataContext } from "../Wrappers/DataContext.jsx";

const ViewCategory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dataContext = useDataContext();

  const [shownCategory, setShownCategory] = useState(location.state.category || {});
  const [categoryItems, setCategoryItems] = useState([]);
  const [percentageOfBudget, setPercentageOfBudget] = useState(0);
  const [noOfTransactions, setNoOfTransactions] = useState(0);

  useEffect(() => {
    if (!dataContext) {
      navigate('/home');
      return;
    }

    const { data, setData } = dataContext;

    if (!data || !data.expenses || !data.expenses[shownCategory]) {
      navigate('/home');
      return;
    }

    setCategoryItems(data.expenses[shownCategory]);
    setNoOfTransactions(data.expenses[shownCategory].length || 0);
    setPercentageOfBudget(convertAndCalculatePercentageOfTotal(data.expenses[shownCategory], data.mainCurrency, data.currencyTable, data.budget));
  }, [dataContext, shownCategory, navigate]);

  const handleCancelButton = () => {
    navigate(-1);
  };

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
    });
  };

  if (!dataContext) {
    return <div>Loading...</div>; // Fallback UI while waiting for dataContext
  }

  const { data } = dataContext;

  if (!data || !data.expenses || !data.expenses[shownCategory]) {
    return <div>Loading...</div>; // Fallback UI while waiting for data
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
          {data.expenses[shownCategory].map((element, index) => (
            <div key={index} className="flex justify-between w-full" onClick={() => handleItemClick(element, index)}>
              <span className="text-2xl">{element[0]}</span>
              <span className="text-2xl">{formatCurrency(element[1], element[2])}</span>
            </div>
          ))}

          {data.expensesFromFamily && Object.entries(data.expensesFromFamily).map(([id, expenses], index) => {
            const nickname = data.familyMembers[id];
            if(expenses.length==0){
              return
            }
            return (
              <div className='gap-2 grid' key={id}>
                <div className='text-xl italic text-emerald-900 font-bold mb-2 mt-4'>{`Expenses added by ${nickname}`}</div>
                {expenses[shownCategory].map(([incomeName, amount, currency], idx) => (
                  <div key={idx} className="flex justify-between w-full">
                    <span className="text-2xl">{incomeName}</span>
                    <span className="text-2xl">{formatCurrency(amount, currency)}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ViewCategory;
