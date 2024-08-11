import { useState } from 'react'
import {formatCurrency} from '../../JS/Utils.js'
import HeroSection from './HeroSection'
import TransactionsContainer from './TransactionsContainer'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'

const MainPage = () => {

  return (
  <div className='bg-primaryBudgetoo h-[100dvh] w-[100dvw]'>
  
    <HeroSection
    />
    
    <TransactionsContainer />
  </div>
  )
}

export default MainPage