import { useState } from 'react'
import {formatCurrency} from '../../JS/Utils.js'
import HeroSection from './HeroSection'
import TransactionsContainer from './TransactionsContainer/TransactionsContainer.jsx'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import useDeviceType from '../../Hooks/useDeviceType.jsx'

const MainPage = () => {

  const device = useDeviceType()

  return (
  <div className={`h-[100dvh] w-[100dvw] ${device.type == 'mobile' ? 'bg-primaryBudgetoo' : 'bg-bgGrayBudgetoo'}`}>
  
    <HeroSection
    />
    
    <TransactionsContainer />
  </div>
  )
}

export default MainPage