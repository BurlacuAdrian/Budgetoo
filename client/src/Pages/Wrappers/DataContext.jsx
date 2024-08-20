import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../../JS/axiosInstance';
import { defaultExpenses, defaultIncome, initialData } from '../../JS/DefaultData';
import Swal from 'sweetalert2';
import '../../App.css'
import {sumAndConvertExpenses, sumAndConvertItems} from '../../JS/Utils.js'
import { socket, socketEmitTransactions } from '../../JS/socketio.js';


const DataContext = createContext({
  budget: 3111,
  mainCurrency: "EUR",
  email: 'email',
  expenses: {},
  income: [],
  totalSpent: 0,
  isPartOfAFamily: false,
  familyMembers: [],
  incomeFromFamily: {},
  error: true
});


export const DataProvider = ({ children }) => {

  const [started, setStarted] = useState(false)

  useEffect( () => {
    if(started===true){
      socket.connect()
    }
    socket.on('receive-changes', newData => {
      console.log(newData)
      handleReceiveChanges(newData)
      
    })
  
    return ()=> {
      socket.off('receive-changes')
      socket.disconnect()
    }
  }, [])

  useEffect( () => {
    if(started===true && !(socket?.connected)){
      socket.connect()
    }
  },[started])

  const today = new Date();

  const [data, setData] = useState(initialData);
  const [refresh, setRefresh] = useState(false)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth()+1)
  const [selectedYear, setSelectedYear] = useState(today.getFullYear())
  

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

      try {
        if(Object.keys(fetchedData.expenses).length == 0 && fetchedData.income.length == 0){
          /* Button order is intentionally reversed! Better UX*/
          const result = await Swal.fire({
            title: 'Welcome!',
            text: "It seems that you're new here. Would you like to generate a template for your expenses and income?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'No, thanks',
            cancelButtonText: 'Yes, generate it!',
            customClass: {
              confirmButton: 'swal2-button',
              cancelButton: 'swal2-button'
            }
          });
        
          if (result.isConfirmed) {// User clicked 'No, thanks'
          } else if (result.isDismissed) {// User clicked 'Yes, generate it!'
            const newData = {
              ...data,
              expenses: defaultExpenses,
              income: defaultIncome
            }
            setData(newData)
            await saveTransactions(newData)

          }
        }
          
      } catch (error) {
        
      }

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReceiveChanges = (receivedData) => {
    console.log('received')
    const sender = receivedData.sender
    if(receivedData.month == data.month && receivedData.year == data.year){
      setData(oldData=>{
        const newData = {
          ...oldData,
        }
        newData.incomeFromFamily[sender] = receivedData.income
        newData.expensesFromFamily[sender] = receivedData.expenses
        return newData
      })
    }
  }

  const getTransactions = async () => {
    try {
      const response = await axiosInstance.get(`/transactions/${data.year}/${data.month}`);
      const fetchedData = response.data;

      setData(oldData=>{
        const newData = {...oldData, 
          budget: fetchedData.budget,
          expenses: fetchedData.expenses,
          income: fetchedData.income,
          isPartOfAFamily: fetchedData.isPartOfAFamily,
          familyMembers: fetchedData.familyMembers,
          incomeFromFamily: fetchedData.incomeFromFamily,
          expensesFromFamily: fetchedData.expensesFromFamily,
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
      if(!started || refresh == true){
        getStartData()
        setStarted(true)
        setRefresh(false)
      }else{
        getTransactions()
      }
    }
  }, [data.year, data.month, refresh])


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
    const socketData = {
      year: newData.year,
      month: newData.month,
      expenses: newData.expenses,
      income: newData.income
    }
    socketEmitTransactions(socketData)
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
      if(!(newExpenses[selectedCategory])){
        newExpenses[selectedCategory]=[]
      }
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
    const socketData = {
      year: newData.year,
      month: newData.month,
      expenses: newData.expenses,
      income: newData.income
    }
    socketEmitTransactions(socketData)
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

  const leaveFamily = async () => {
    try {
      const response = await axiosInstance.post(`/leave`)
      if (response.status != 200) {
        return false
      }
      setData(oldData=>{
        const newData = {
          ...oldData,
          isPartOfAFamily: false,
          familyMembers: {}
        }
        return newData
      })
      return true
    } catch (error) {
      return false
    }
  }

  const addExpense = async (year, month, category, name, amount, currency) => {
    try {
      const response = await axiosInstance.put('/expense', {
        year,
        month,
        category,
        name,
        amount,
        currency
      });
      
      if (response.status !== 200) {
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error adding expense:', error);
      return false;
    }
  }

  const addIncome = async (year, month, name, amount, currency) => {
    try {
      const response = await axiosInstance.put('/income', {
        year,
        month,
        name,
        amount,
        currency
      });
      
      if (response.status !== 200) {
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error adding income:', error);
      return false;
    }
  }

  const saveTransactions = async (newData) => {
    try {
      console.log(newData)
      const response = await axiosInstance.put(`/transactions`, newData)

  
      if (response.status != 200) {
        Swal.fire('Failed to save transactions', '', 'error')
        return false
      }
      return true
    } catch (error) {
      return false
    }
  }

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
        saveNickname,
        leaveFamily,
        addExpense,
        addIncome,
        saveTransactions
      }
    }, setData, loading, error, setRefresh 
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
