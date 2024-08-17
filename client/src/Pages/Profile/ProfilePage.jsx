import { useNavigate } from "react-router-dom"
import ButtonDarkOnWhite from "../../Components/ButtonDarkOnWhite"
import { useDataContext } from "../Wrappers/DataContext"
import useDeviceType from "../../Hooks/useDeviceType"

const ProfilePage = () => {

  const { data } = useDataContext()

  const navigate = useNavigate()

  const handleCancelButton = () => {
    navigate('/home')
  }

  const handleLogoutButton = () => {

    //TODO add logic
    navigate('/login')
  }

  const username = "John Smith"
  const email = "john@budgetoo.eu"

  const device = useDeviceType()

  if (device.type == 'mobile') {
    return (
      <div className='bg-primaryBudgetoo h-[100dvh] w-[100dvw] flex flex-col'>
        <div className="flex-grow"></div>
        <div className='bg-white w-full h-[90%] mt-auto rounded-t-[4rem] flex flex-col items-center pt-6 px-8'>

          <div className="relative w-full flex items-start" onClick={handleCancelButton}>
            <img src='./cancel.svg' className="size-8 inline " />
            <span className="absolute w-full text-center font-bold text-xl">Profile</span>
          </div>

          <div className="grid grid-cols-3 w-full p-4 mt-8 gap-6">
            <img src="./dog-1.jpeg" className="rounded-2xl" />
            <span className="text-3xl col-span-2 flex items-center font-bold">{username}</span>

            <div className="col-span-3 flex flex-col gap-4 mt-6">
              <div className="col-span-3 text-2xl">Email</div>
              <div className="col-span-3 text-3xl">{data.email}</div>
            </div>
          </div>

          <ButtonDarkOnWhite style={'mt-10'} onClickHandler={handleLogoutButton} text={"Logout"} />



        </div>
      </div>
    )
  }

  return (<div className='w-full h-[80%] flex'>

    <div className='h-full w-[10%] min-w-[10%]'></div>

    <div className='flex flex-col w-[90%] max-w-[90%] h-full p-20 align-middle'>
      <div className="relative w-full flex items-start" onClick={handleCancelButton}>
        <img src='./cancel.svg' className="size-8 inline " />
        <span className="absolute w-full text-center font-bold text-xl">Profile</span>
      </div>

      <div className="grid grid-cols-3 w-full p-4 mt-8 gap-6">
        <img src="./dog-1.jpeg" className="rounded-2xl" />
        <span className="text-3xl col-span-2 flex items-center font-bold">{username}</span>

        <div className="col-span-3 flex flex-col gap-4 mt-6">
          <div className="col-span-3 text-2xl">Email</div>
          <div className="col-span-3 text-3xl">{data.email}</div>
        </div>
      </div>

      <ButtonDarkOnWhite style={'mt-10'} onClickHandler={handleLogoutButton} text={"Logout"} />
    </div>
  </div>)
}

export default ProfilePage