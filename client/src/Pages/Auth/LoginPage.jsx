import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ToggleButton from "../../Components/ToggleButton";
import ButtonDarkOnWhite from "../../Components/ButtonDarkOnWhite";
import { GoogleLogin } from '@react-oauth/google'
import axiosInstance from "../../JS/axiosInstance.js";
import swal from "sweetalert";

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

  const handleBottomButtonClick = async () => {
    handleLogin()
    //TODO update
    // navigate('/home')

    if (choseLogin) {

      return
    }
  }

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post("/login", {
        email: emailInputText,
        password: passwordInputText
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 200) {
        // localStorage.setItem("username", username);
        swal("Successfully logged in!")
        navigate('/home');
      } else {
        swal("Login failed", "Please try again", "error")
      }
    } catch (error) {
      swal("Login failed", "Please verify your input, make sure you're only use alphanumeric characters and no spaces or special characters for the username", "error")
      console.error('API call error:', error);
    }
  }

  return (
    <div className="bg-primaryBudgetoo w-[100dvw] h-[100dvh]">
      <div className="text-white w-full h-1/5 flex justify-center items-center text-[3rem] font-bold">Welcome !</div>
      <div className='bg-white w-full h-4/5 rounded-t-[4rem] flex flex-col items-center'>

        <ToggleButton comparandBase={choseLogin} leftComparand={true} rightComparand={false} leftText='Login' rightText='Signup' leftClickHandler={handleChooseLogin} rightClickHandler={handleChooseSignup} />

        <div className="w-full mt-6 px-12">
          <div>Username</div>
          <input className="rounded-full w-full bg-gray-300 h-16 p-4" value={emailInputText} onChange={(e) => setEmailInputText(e.target.value)}></input>
          <div className="mt-6">Password</div>
          <input className="rounded-full w-full bg-gray-300 h-16 p-4" type="password" value={passwordInputText} onChange={(e) => setPasswordInputText(e.target.value)}></input>

          {choseLogin ? (
            //Login
            <div>

            </div>
          ) : (
            //Signup
            <div>
              <div className="mt-6">Repeat Password</div>
              <input className="rounded-full w-full bg-gray-300 h-16 p-4" type="password" value={repeatInputText} onChange={(e) => setRepeatInputText(e.target.value)}></input>
            </div>
          )}

          <div className="font-bold flex justify-center mt-8">Or you can choose :</div>
          <div className="flex justify-around pt-4">
            {/* <ButtonDarkOnWhite text="Google" style='w-1/3' /> */}

            {/* <GoogleLogin
              onSuccess={(credentialResponse) => {
                handleGoogleSuccess(credentialResponse);
              }}
              onError={() => {
                handleGoogleError()
              }}
            /> */}

            <div id="g_id_onload"
              data-client_id="234249355532-rabgj6tqab4fgg9p76vj5bg75s31rd8p.apps.googleusercontent.com"
              data-context="signin"
              data-ux_mode="popup"
              data-login_uri="http://localhost:8020/v1/google-login"
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
            {/* <ButtonDarkOnWhite text="Facebook" style='w-1/3' /> */}
          </div>

          <div className="w-full flex items-center justify-center mt-12">
            <ButtonDarkOnWhite text={bottomButtonText} className='' onClickHandler={handleBottomButtonClick} />
          </div>

        </div>
      </div>
    </div>
  )

}

export default LoginPage
