import { useState } from 'react'
import { formatCurrency } from './JS/Utils'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainPage from './Pages/Home/MainPage'
import AddPage from './Pages/AddTransaction/AddPage'
import NavBar from './Pages/Wrappers/NavBar'
import ViewCategory from './Pages/Home/ViewCategory'
import PaymentsPage from './Pages/Payments/PaymentsPage'
import InsightsPage from './Pages/Insights/InsightsPage'
import ProfilePage from './Pages/Profile/ProfilePage'
import LoginPage from './Pages/Auth/LoginPage'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { DataProvider } from './Pages/Wrappers/DataContext'

function App() {


  return (
    <DataProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <div>
            <NavBar />
            <Routes>
              <Route path='/home' element={<MainPage />} />
              <Route path='/add' element={<AddPage />} />
              <Route path='/view' element={<ViewCategory />} />
              <Route path='/payments' element={<PaymentsPage />} />
              <Route path='/insights' element={<InsightsPage />} />
              <Route path='/profile' element={<ProfilePage />} />


              <Route path='/' element={<LoginPage />} />
              <Route path='/login' element={<LoginPage />} />


            </Routes>
          </div>
        </BrowserRouter>
      </GoogleOAuthProvider >
    </DataProvider>
  )
}

export default App
