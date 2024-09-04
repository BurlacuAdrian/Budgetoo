import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ToggleButton from "../../Components/ToggleButton";
import ButtonDarkOnWhite from "../../Components/ButtonDarkOnWhite";
import { GoogleLogin } from '@react-oauth/google'
import axiosInstance from "../../JS/axiosInstance.js";
import swal from "sweetalert";
import useDeviceType from "../../Hooks/useDeviceType.jsx";
import { useDataContext } from "../Wrappers/DataContext.jsx";
import LoadingScreen from "../../Components/LoadingScreen.jsx";

const LoginPage = ({ }) => {

  const [choseLogin, setChoseLogin] = useState(true)
  const [bottomButtonText, setBottomButtonText] = useState('Login')
  const [emailInputText, setEmailInputText] = useState('')
  const [passwordInputText, setPasswordInputText] = useState('')
  const [repeatInputText, setRepeatInputText] = useState('')
  const navigate = useNavigate()

  const handleChooseLogin = () => {
    setChoseLogin(true)
    setBottomButtonText('Login')
  }

  const handleChooseSignup = () => {
    setChoseLogin(false)
    setBottomButtonText('Signup')
  }

  const handleBottomButtonClick = (event) => {
    event.preventDefault()

    if (choseLogin) {
      handleLogin()
      return
    }
    handleLogin(false)
  }


  const dataContext = useDataContext()

  const handleLogin = async (login = true) => {
    const path = (login === true ? '/login' : '/signup')
    setLoading(true)
    // setTimeout( () => {
    //   setLoading(false)
    // }, 1000)
    try {
      const response = await axiosInstance.post(path, {
        email: emailInputText,
        password: passwordInputText
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        
        if(dataContext){
          const {setRefresh} = dataContext
          setRefresh(true)
        }
        // console.log("going home")
        navigate('/home');
      } else {
        swal("Login failed", "Please try again", "error")
        setLoading(false)
      }
    } catch (error) {
      const message = error.response.data.error ? ` : ${error.response.data.error} ` : ''
      swal(`Login failed ${message}`, `Please verify your input, make sure you're only using alphanumeric characters and no spaces or special characters for the email`, "error")
      console.error('API call error:', error);
      setLoading(false)
    }
  }

  const device = useDeviceType()
  const googleLoginAvailable = false

  const [loading, setLoading] = useState(true)

  useEffect( () => {
    setTimeout( () => {
      setLoading(false)
    }, 1500)
  }, [])

  if(loading){
    return <LoadingScreen></LoadingScreen>
  }

  if (device.type == 'mobile') {
    return (
      <div className="bg-primaryBudgetoo w-[100dvw] h-[100dvh]">
        <div className="text-white w-full h-1/5 flex justify-center items-center text-[2rem] font-bold">Welcome to Budgetoo!</div>
        <div className='bg-white w-full h-4/5 rounded-t-[4rem] flex flex-col items-center'>

          <ToggleButton comparandBase={choseLogin} leftComparand={true} rightComparand={false} leftText='Login' rightText='Signup' leftClickHandler={handleChooseLogin} rightClickHandler={handleChooseSignup} />

          <form className="w-full mt-6 px-12">
            <div>Username</div>
            <input className="rounded-full w-full bg-gray-300 h-16 p-4" value={emailInputText} onChange={(e) => setEmailInputText(e.target.value)} type="email" autoComplete="email"></input>
            <div className="mt-6">Password</div>
            <input className="rounded-full w-full bg-gray-300 h-16 p-4" type="password" value={passwordInputText} onChange={(e) => setPasswordInputText(e.target.value)} autoComplete="current-password"></input>

            {choseLogin ? (
              <div>
              </div>
            ) : (
              <div>
                <div className="mt-6">Repeat Password</div>
                <input className="rounded-full w-full bg-gray-300 h-16 p-4" type="password" value={repeatInputText} onChange={(e) => setRepeatInputText(e.target.value)}></input>
              </div>
            )}



            {googleLoginAvailable && (
              <div className="flex justify-around pt-4">

                <div className="font-bold flex justify-center mt-8">Or you can choose :</div>

                <div id="g_id_onload"
                  data-client_id={process.env.GOOGLE_CLIENT_ID}
                  data-context="signin"
                  data-ux_mode="popup"
                  data-login_uri={`${process.env.API_URL}/v1/google-login`}
                  data-nonce=""
                  data-auto_prompt="false">
                </div>

                <div className="g_id_signin"
                  data-type="standard"
                  data-shape="rectangular"
                  data-theme="outline"
                  data-text="signin_with"
                  data-size="large"
                  data-logo_alignment="left">
                </div>

              </div>
            )}

            <div className="w-full flex items-center justify-center mt-12">
              {/* <button type="button" onClick={(e)=>handleBottomButtonClick(e)}>{bottomButtonText}</button> */}
              <ButtonDarkOnWhite text={bottomButtonText} className='' onClickHandler={(e)=>handleBottomButtonClick(e)} />
            </div>

          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-primaryBudgetoo w-[100dvw] h-[100dvh]">
      <div className="text-white w-full h-1/5 flex justify-center items-center text-[2rem] font-bold">Welcome to Budgetoo!</div>
      <div className='bg-white w-1/2 mx-auto h-4/5 rounded-t-[4rem] flex flex-col items-center'>

        <ToggleButton comparandBase={choseLogin} leftComparand={true} rightComparand={false} leftText='Login' rightText='Signup' leftClickHandler={handleChooseLogin} rightClickHandler={handleChooseSignup} className='!mt-12 !mb-10' />

        <form className="w-full mt-6 px-[20%]">
          <div className="mb-4 text-xl">Email</div>
          <input className="rounded-full w-full bg-gray-300 h-16 p-4 text-xl" value={emailInputText} onChange={(e) => setEmailInputText(e.target.value)} type="email" autoComplete="email"></input>
          <div className="mt-6 mb-4 text-xl">Password</div>
          <input className="rounded-full w-full bg-gray-300 h-16 p-4 text-xl" type="password" value={passwordInputText} onChange={(e) => setPasswordInputText(e.target.value)} autoComplete="current-password"></input>

          {choseLogin ? (
            <div>
            </div>
          ) : (
            <div>
              <div className="mt-6 mb-4 text-xl">Repeat Password</div>
              <input className="rounded-full w-full bg-gray-300 h-16 p-4 text-xl" type="password" value={repeatInputText} onChange={(e) => setRepeatInputText(e.target.value)}></input>
            </div>
          )}

          {googleLoginAvailable && (

            <div className="flex justify-around pt-4">

              <div className="font-bold flex justify-center mt-8">Or you can choose :</div>

              <div id="g_id_onload"
                data-client_id={process.env.GOOGLE_CLIENT_ID}
                data-context="signin"
                data-ux_mode="popup"
                data-login_uri={`${process.env.API_URL}/v1/google-login`}
                data-nonce=""
                data-auto_prompt="false">
              </div>

              <div className="g_id_signin"
                data-type="standard"
                data-shape="rectangular"
                data-theme="outline"
                data-text="signin_with"
                data-size="large"
                data-logo_alignment="left">
              </div>

            </div>
          )}

          <div className="w-full flex items-center justify-center mt-12">
          <ButtonDarkOnWhite text={bottomButtonText} className='' onClickHandler={(e)=>handleBottomButtonClick(e)} />
          </div>

        </form>
      </div>
    </div>
  )


}

export default LoginPage
