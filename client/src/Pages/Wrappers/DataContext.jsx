import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../../JS/axiosInstance';
import { defaultExpenses, defaultIncome, initialData } from '../../JS/DefaultData';
import Swal from 'sweetalert2';
import '../../App.css'
import {sumAndConvertExpenses, sumAndConvertItems} from '../../JS/Utils.js'
import useDeviceType from '../../Hooks/useDeviceType.jsx';
import { useNavigate } from 'react-router-dom';


const DataContext = createContext({
  budget: 3111,
  mainCurrency: "EUR",
  email: 'email',
  expenses: {},
  income: [],
  totalSpent: 0,
  isPartOfAFamily: false,
  familyMembers: [],
  incomeFromFamily: {}
});


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
        totalSpent: 0,
        isPartOfAFamily: fetchedData.isPartOfAFamily,
        familyMembers: fetchedData.familyMembers,
        incomeFromFamily: fetchedData.incomeFromFamily,
        expensesFromFamily: fetchedData.expensesFromFamily,
        nickname: fetchedData.nickname
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

      setData(oldData=>{
        const newData = {...oldData, 
          budget: fetchedData.budget,
          expenses: fetchedData.expenses,
          income: fetchedData.income,
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

  const saveBudget = async (amount, currency) => {
    
    const newData = {
      ...data,
      budget: +amount,
      mainCurrency: currency
    }
    
    const response = await axiosInstance.put(`/transactions`, {
      ...newData,
      month: selectedMonth,
      year: selectedYear,
      main_currency: currency
    });


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
      return false
    }

    setData(newData)

    return true
  }

  const deleteIncomeByIndex = async (index) => {
    const newIncome = [...data.income]

    newIncome.splice(index, 1)

    const newData = {
      ...data,
      income: newIncome
    }

    const response = await axiosInstance.put(`/transactions`, newData)
    if (response.status != 200) {
      return false
    }

    setData(newData)
    return true
  }

  
  const deleteExpenseByCategoryAndIndex = async (selectedCategory, index) => {
    const newExpenses = { ...data.expenses }

    newExpenses[selectedCategory].splice(index, 1)

    const newData = {
      ...data,
      expenses: newExpenses
    }

    const response = await axiosInstance.put(`/transactions`, newData)
    if (response.status != 200) {
      return false
    }

    setData(newData)
    return true
  }

  const sendInvite = async (toEmail) => {
    try {
      const response = await axiosInstance.post(`/invite`, {
        email: toEmail
      })
      if (response.status != 200) {
        return false
      }
      return true
    } catch (error) {
      return false
    }
    
  }

  const saveNickname = async (nickname) => {
    try {
      const response = await axiosInstance.put(`/nickname/${nickname}`)
      if (response.status != 200) {
        return false
      }
      setData(oldData=>{
        const newData = {
          ...oldData,
          nickname
        }
        return newData
      })
      return true
    } catch (error) {
      return false
    }
  }

  useEffect( () => {
    console.log(data)
  },[data])

  // Auto-update data when expenses or income change
  useEffect(() => {
    // if(data?.expenses){
      setData(oldData => {
        const newData = {
          ...oldData,
          // totalSpent: calculateTotalSpent(data.expenses)
          totalSpent: sumAndConvertExpenses(data.expenses, data.mainCurrency, data.currencyTable)

        }
        return newData
      });
    // }
    
  }, [data.expenses, data.mainCurrency])

  const value = {
    data: {
      ...data,
      API: {
        saveBudget,
        saveIncome,
        saveExpenses,
        deleteIncomeByIndex,
        deleteExpenseByCategoryAndIndex,
        sendInvite,
        saveNickname
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
