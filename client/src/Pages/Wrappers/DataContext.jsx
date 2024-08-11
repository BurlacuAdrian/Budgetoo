import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../../JS/axiosInstance';
import { defaultExpenses, defaultIncome, initialData } from '../../JS/DefaultData';
import Swal from 'sweetalert2';
import '../../App.css'

const DataContext = createContext({
  budget: 3111,
  mainCurrency: "EUR",
  email: 'email',
  expenses: {},
  income: [],
  totalSpent: 0
});

//TODO account for different currencies
const calculateTotalSpent = (expenses) => {
  var sum = 0
  for (const key in expenses) {
    expenses[key].forEach(([, amount, currency]) => {
      sum += (isNaN(+amount) ? 0 : +amount)
    })
  }

  return sum
}

export const DataProvider = ({ children }) => {

  const today = new Date();

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth()+1)
  const [selectedYear, setSelectedYear] = useState(today.getFullYear())
  const [started, setStarted] = useState(false)

  const getStartData = async () => {
    try {
      const response = await axiosInstance.get(`/start-data/${selectedYear}/${selectedMonth}`);
      const fetchedData = response.data;
      // console.log(response.data)

      setData({
        year: selectedYear,
        month: selectedMonth,
        budget: fetchedData.budget,
        mainCurrency: fetchedData.main_currency,
        currencyTable: fetchedData.currency_table,
        email: fetchedData.email,
        picture: fetchedData.picture,
        expenses: fetchedData.expenses,
        income: fetchedData.income,
        totalSpent: calculateTotalSpent(fetchedData.expenses)
      });

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getTransactions = async () => {
    try {
      const response = await axiosInstance.get(`/transactions/${data.year}/${data.month}`);
      const fetchedData = response.data;
      // console.log(response.data)

      setData(oldData=>{
        const newData = {...oldData, 
          budget: fetchedData.budget,
          expenses: fetchedData.expenses,
          income: fetchedData.income,
          totalSpent: calculateTotalSpent(fetchedData.expenses)
        }
        return newData
      });

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // console.log(window.location.pathname)
    if (window.location.pathname != '/login' && window.location.pathname != '/') {
      if(!started){
        getStartData()
        setStarted(true)
      }else{
        getTransactions()
      }
    }
  // }, [])
  }, [data.year, data.month])

  const saveBudget = async (amount) => {
    
    const newData = {
      ...data,
      budget: +amount
    }
    
    const response = await axiosInstance.put(`/transactions`, {
      ...newData,
      month: selectedMonth,
      year: selectedYear
    });

    console.log(response)

    if (response.status != 200) {
      Swal.fire('Failed to save budget', '', 'error')
      return
    }
    
    setData(newData)
  }

  const saveIncome = async ([expenseName, amount, currency], isEditing, index) => {
    const newIncome = [...data.income]

    if (isEditing) {
      newIncome[index]=[
        expenseName,
        amount,
        currency
      ]
    } else {
    newIncome.push([
      expenseName,
      amount,
      currency
    ])
    }

    const newData = {
      ...data,
      income: newIncome
    }

    console.log(newData)

    const response = await axiosInstance.put(`/transactions`, newData)
    if (response.status != 200) {
      Swal.fire('Failed to add transaction', '', 'error')
      return false
    }

    setData(newData)
    return true
  }

  const saveExpenses = async ( [expenseName, amount, currency], isEditing, index, selectedCategory) => {
    const newExpenses = { ...data.expenses }

    if (isEditing) {
      newExpenses[selectedCategory][index] = [
        expenseName,
        amount,
        currency
      ]
    } else {
      newExpenses[selectedCategory].push([
        expenseName,
        amount,
        currency
      ])
    }

    const newData = {
      ...data,
      expenses: newExpenses
    }

    const response = await axiosInstance.put(`/transactions`, newData)
    if (response.status != 200) {
      Swal.fire('Failed to add transaction', '', 'error')
      return false
    }

    setData(newData)

    return true
  }

  /**
   * Auto-update data when expenses or income change
   */
  useEffect(() => {
    if(data?.expenses){
      setData(oldData => {
        const newData = {
          ...oldData,
          totalSpent: calculateTotalSpent(data.expenses)
        }
        return newData
      });
    }
    
  }, [data.expenses, data.income])

  const value = {
    data: {
      ...data,
      API: {
        saveBudget,
        saveIncome,
        saveExpenses
      }
    }, setData, loading, error, 
  };


  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};


export const useDataContext = () => {
  return useContext(DataContext);
};
