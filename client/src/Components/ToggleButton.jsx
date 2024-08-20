

const ToggleButton = ({comparandBase, leftComparand, rightComparand, leftText, rightText, leftClickHandler, rightClickHandler, className}) => {

  return (
    <div className={"flex rounded-full bg-gray-300 p-0 mt-4"+' '+className}>
      <button
        className={`px-10 py-4 rounded-full ${comparandBase == leftComparand ? 'bg-accentBudgetoo text-white' : 'bg-gray-300 text-black'
          }`}
        onClick={() => leftClickHandler()}
      >
        {leftText}
      </button>
      <button
        className={`px-10 py-4 rounded-full ${comparandBase == rightComparand ? 'bg-accentBudgetoo text-white' : 'bg-gray-300 text-black'
          }`}
        onClick={() => rightClickHandler()}
      >
        {rightText}
      </button>
    </div>
  )

}

export default ToggleButton