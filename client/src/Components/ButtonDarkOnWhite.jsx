import { useState } from "react"

const ButtonDarkOnWhite = ({style, onClickHandler, text, className}) => {


  return (
    <span className={'w-1/2 bg-accentBudgetoo rounded-full h-16 text-white inline-flex justify-center items-center text-xl'+' '+style+' '+className} onClick={onClickHandler}>
      {text}
    </span>
  )
}

export default ButtonDarkOnWhite