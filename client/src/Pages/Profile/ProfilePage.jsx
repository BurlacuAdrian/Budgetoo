import { useNavigate } from "react-router-dom"
import ButtonDarkOnWhite from "../../Components/ButtonDarkOnWhite"
import { useDataContext } from "../Wrappers/DataContext"
import useDeviceType from "../../Hooks/useDeviceType"
import { useEffect, useState } from "react"
import AddMemberModal from "./AddMemberModal"
import Swal from "sweetalert2"
import axiosInstance from "../../JS/axiosInstance"
import { socket } from "../../JS/socketio"

const ProfilePage = () => {

  var dataContext = useDataContext()

  if (!dataContext) {
    console.log(dataContext)
    return <div>Loading profile page...</div>; // TODO some other fallback UI
  }
  const { data, setData } = dataContext

  const navigate = useNavigate()

  const handleCancelButton = () => {
    navigate('/home')
  }

  const handleLogoutButton = async () => {
    try {
      const response = await axiosInstance.post('/logout');
      socket.disconnect()
      if (response.status === 200) {
        Swal.fire({
          title: 'Logged Out',
          text: 'You have been successfully logged out.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          
          navigate('/login');
        });
      }
    } catch (error) {
      console.log(error)
    }
  };

  const username = "John Smith"

  const device = useDeviceType()


  /*** Modal handling ***/

  const [isAddMemberModalVisible, setIsAddMemberModalVisible] = useState(false)

  const openAddMemberPopup = () => {
    setIsAddMemberModalVisible(true)
  }

  const closeAddMemberPopup = () => {
    setIsAddMemberModalVisible(false)
  }

  const handleEditNickname = () => {
    setEditingNickname(true)
  }

  const handleSaveNickname = async () => {
    try {
      const success = await data.API.saveNickname(nickname);
      
      setEditingNickname(false);
      
      if (success === true) {
        // Swal.fire('Invitation has been sent', '', 'success');
      } else {
        Swal.fire('Nickname change error', '', 'error');
      }
    } catch (error) {
      Swal.fire('Something went wrong', 'Please try again later.', 'error');
    }
  }

  const [editingNickname, setEditingNickname] = useState(false)
  const [nickname, setNickname] = useState(data.nickname)

  const handleLeaveFamily = async () => {
    try {
      const success = await data.API.leaveFamily();

      if (success === true) {
        Swal.fire('Successfully left', '', 'success');
      } else {
        Swal.fire('Could not leave', '', 'error');
      }
    } catch (error) {
      Swal.fire('Something went wrong', 'Please try again later.', 'error');
    }
  }

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
            {editingNickname === false && <span className="text-3xl col-span-2 flex items-center font-bold" onClick={handleEditNickname}>{data.nickname ?? 'Click to set your nickname'}<img src='./pencil.svg' className="size-12"/></span>
            }
            {editingNickname && (
              <span>
                <input value={nickname} onChange={(e)=>setNickname(e.target.value)} className="bg-gray-100 p-2 rounded-xl" placeholder="Enter a new nickname"/>
                <div className="flex justify-around w-full gap-12">
                  <button className="bg-red-200 py-2 px-4 rounded-xl" onClick={()=>setEditingNickname(false)}>Cancel</button>
                  <button className="bg-green-200 py-2 px-4 rounded-xl" onClick={handleSaveNickname}>Save</button>
                </div>
              </span>
            )}

            <div className="col-span-3 flex flex-col gap-4 mt-6">
              {/* <div className="col-span-3 text-2xl">Email</div> */}
              <div className="col-span-3 text-xl">Email : {data.email}</div>
            </div>
          </div>

          <div className="w-full ">
            <h1 className="text-[2rem] mt-0 mb-4">Family budgeting</h1>
            {data.isPartOfAFamily === false && (
              <div>Currently not part of a family. It's better together!</div>
            )}

            {data.isPartOfAFamily && (
              <div>
                <div className="text-xl">Members:</div>
                <ul>
                {Object.entries(data.familyMembers).map(([memberId, memberName], index) => {
                    return <div>{memberName}</div>
                  })}
                </ul>
                <div className="w-full flex mt-2 gap-4">
                  <ButtonDarkOnWhite className={'bg-red-400 text-center'} onClickHandler={handleLeaveFamily} text={"Leave budget together"} />
                  <ButtonDarkOnWhite className={'text-center'} onClickHandler={openAddMemberPopup} text={data.isPartOfAFamily ? 'Invite another user' : 'Budget together!'} />
                  
                </div>
              </div>
            )}
          </div>

          {!(data.isPartOfAFamily) && <ButtonDarkOnWhite className={'text-center mt-4'} onClickHandler={openAddMemberPopup} text={data.isPartOfAFamily ? 'Invite another user' : 'Budget together!'} />}
          <ButtonDarkOnWhite className={'mt-10 bg-red-400'} onClickHandler={handleLogoutButton} text={"Logout"} />

          {isAddMemberModalVisible && <AddMemberModal closeModal={closeAddMemberPopup} data={data} setData={setData} />}
        </div>
      </div>
    )
  }

  return (<div className='w-full h-[80%] flex'>

    <div className='h-full w-[10%] min-w-[10%]'></div>

    <div className='w-[90%] max-w-[90%] h-full p-20 align-middle grid grid-cols-2'>
      <div className="col-span-1 flex flex-col ">
        <div className="relative w-full flex items-start" onClick={handleCancelButton}>
          <img src='./cancel.svg' className="size-8 inline " />
          <span className="absolute w-full text-center font-bold text-xl">Profile</span>
        </div>

        <div className="grid grid-cols-3 w-full p-4 mt-8 gap-6">
          <img src="./dog-1.jpeg" className="rounded-2xl" />
          {editingNickname === false && <span className="text-3xl col-span-2 flex items-center font-bold" onClick={handleEditNickname}>{data.nickname ?? 'Click to set your nickname'}<img src='./pencil.svg' className="size-12"/></span>
            }
            {editingNickname && (
              <span>
                <input value={nickname} onChange={(e)=>setNickname(e.target.value)} className="bg-gray-100 p-2 rounded-xl"/>
                <div className="flex justify-around w-full gap-12">
                  <button className="bg-red-200 py-2 px-4 rounded-xl" onClick={()=>setEditingNickname(false)}>Cancel</button>
                  <button className="bg-green-200 py-2 px-4 rounded-xl" onClick={handleSaveNickname}>Save</button>
                </div>
              </span>
            )}

          <div className="col-span-3 flex flex-col gap-4 mt-6">
            <div className="col-span-3 text-2xl">Email</div>
            <div className="col-span-3 text-3xl">{data.email}</div>
          </div>
        </div>

        <ButtonDarkOnWhite className={'mt-10 bg-red-400'} onClickHandler={handleLogoutButton} text={"Logout"} />
      </div>

      <div className="w-full col-span-1">
        <h1 className="text-[2rem] mt-8 mb-4">Family budgeting</h1>
        {data.isPartOfAFamily === false && (
          <div>Currently not part of a family. It's better together!</div>
        )}

        {data.isPartOfAFamily && (
          <div>
            <div className="text-xl">Members:</div>
            <ul>
              {Object.entries(data.familyMembers).map(([memberId, memberName], index) => {
                return <div>{memberName}</div>
              })}
            </ul>
            <ButtonDarkOnWhite className={'mt-10 bg-red-400'} onClickHandler={handleLeaveFamily} text={"Leave budget together"} />
          </div>
          
        )}
        <ButtonDarkOnWhite className={'mt-10'} onClickHandler={openAddMemberPopup} text={data.isPartOfAFamily ? 'Invite another user' : 'Budget together!'} />
      </div>



      {isAddMemberModalVisible && <AddMemberModal closeModal={closeAddMemberPopup} data={data} setData={setData} />}
    </div>
  </div>)
}

export default ProfilePage