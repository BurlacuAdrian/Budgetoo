import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDataContext } from './DataContext'
import useDeviceType from '../../Hooks/useDeviceType.jsx'

function NavBar() {

  const location = useLocation()
  var dataContext = useDataContext()
  // var dataConext = useContext(DataC)
  if (!dataContext) {
    console.log(dataContext)
    return <div>Loading hero section...</div>; // TODO some other fallback UI
  }
  // const { data, setData, device} = dataContext

  const device = useDeviceType()

  const getVisibility = () => {
    //TODO change logic
    return (location.pathname == '/login' || location.pathname == '/signup' || location.pathname == '/') ? false : true
  }

  useEffect(() => {

    setIsVisible(getVisibility())
  }, [location.pathname])


  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(getVisibility())

  const handleMainAction = () => {
    navigate('/add')
  }

  const handleBudgetButton = () => {
    if (location.pathname == '/home')
      return

    navigate('/home')
  }

  const handlePaymentsButton = () => {
    if (location.pathname == '/payments')
      return

    navigate('/payments')
  }

  const handleInsightsButton = () => {
    if (location.pathname == '/insights')
      return

    navigate('/insights')
  }

  const handleProfileButton = () => {
    if (location.pathname == '/profile')
      return

    navigate('/profile')
  }

  const getImgStyle = (filePrefix, highlightedPath) => {
    return location.pathname == highlightedPath ? `./${filePrefix}-primary.svg` : `./${filePrefix}-white.svg`
  }

  const getSpanStyle = (highlightedPath) => {
    return location.pathname == highlightedPath ? 'text-primaryBudgetoo' : 'text-white'
  }

  if (!isVisible) {
    return
  }

  if (device.type == 'mobile') {
    return (<div className='bg-accentBudgetoo w-full h-[10%] bottom-0 fixed rounded-t-[3rem] px-8 gap-4 items-center flex justify-around'>
      <div className=' grid grid-cols-2 gap-4'>
        <div className='flex flex-col items-center' onClick={handleBudgetButton}>
          <img src={getImgStyle('wallet', '/home')} className=''></img>
          <span className={getSpanStyle('/home')} >Budget</span>
        </div>
        <div className='flex flex-col items-center' onClick={handlePaymentsButton}>
          <img src={getImgStyle('cash', '/payments')} className=''></img>
          <span className={getSpanStyle('/payments')} >Payments</span>
        </div>
      </div>

      <div className='' onClick={handleMainAction}>
        <span className='bg-accentBudgetoo rounded-full z-10 block w-24 h-24 relative -top-8 p-4'>
          <img src='./add-white.svg' className=''></img>
        </span>

        <span className='text-white'></span>
      </div>
      <div className=' grid grid-cols-2 gap-4 items-center'>
        <div className='flex flex-col items-center' onClick={handleInsightsButton}>
          <img src={getImgStyle('graph', '/insights')} className=''></img>
          <span className={getSpanStyle('/insights')}>Insights</span>
        </div>
        <div className='flex flex-col items-center' onClick={handleProfileButton}>
          <img src={getImgStyle('profile', '/profile')} className=''></img>
          <span className={getSpanStyle('/profile')}>Profile</span>
        </div>
      </div>

    </div>)
  }

  //TODO tablet
  return (
    <div className='bg-accentBudgetoo w-[10%] h-[100dvh] fixed rounded-tr-[6rem] rounded-br-[6rem] px-14 py-16 flex flex-col justify-between items-center'>

      <div className='grid grid-cols-1 gap-20'>
        <div className='flex flex-col items-center' onClick={handleBudgetButton}>
          <img src={getImgStyle('wallet', '/home')} className=''></img>
          <span className={getSpanStyle('/home')} >Budget</span>
        </div>
        <div className='flex flex-col items-center' onClick={handlePaymentsButton}>
          <img src={getImgStyle('cash', '/payments')} className=''></img>
          <span className={getSpanStyle('/payments')} >Payments</span>
        </div>
        <div className='flex flex-col items-center' onClick={handleInsightsButton}>
          <img src={getImgStyle('graph', '/insights')} className=''></img>
          <span className={getSpanStyle('/insights')}>Insights</span>
        </div>
      </div>

      <div className='' onClick={handleMainAction}>
        <span className='bg-primaryBudgetoo rounded-full z-10 block w-32 h-32 p-6'>
          <img src='./add-white.svg' className=''></img>
        </span>

        <span className='text-white'></span>
      </div>

      <div className='flex flex-col items-center' onClick={handleProfileButton}>
        <img src={getImgStyle('profile', '/profile')} className=''></img>
        <span className={getSpanStyle('/profile')}>Profile</span>
      </div>
    </div>
  )

}

export default NavBar
