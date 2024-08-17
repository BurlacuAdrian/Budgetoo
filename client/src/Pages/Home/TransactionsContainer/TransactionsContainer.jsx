import { useEffect, useState } from 'react'
import { convertAndCalculatePercentageOfTotal} from '../../../JS/Utils.js'
import { useDataContext } from '../../Wrappers/DataContext.jsx';
import { defaultExpenses } from '../../../JS/DefaultData.js';
import useDeviceType from '../../../Hooks/useDeviceType.jsx'
import Swal from 'sweetalert2';
import TransactionsContainerDesktop from './TransactionsContainerDesktop.jsx';
import TransactionsContainerMobile from './TransactionsContainerMobile.jsx';

const getColorForCategory = (category) => {
  switch (category) {
    case 'Housing':
      return 'text-blue-400'
    case 'Transportation':
      return 'text-slate-600'
    case 'Food':
      return 'text-amber-900'
    case 'Health':
      return 'text-red-500'
    default:
      return 'text-primaryBudgetoo'
  }
}

const countTransactions = (items) => {
  return items.length
}


const TransactionsContainer = () => {

  const dataContext = useDataContext()
  if (!dataContext) {
    return <div>Loading transactions...</div>; // TODO some other fallback UI
  }
  const { data, setData } = dataContext

  const device = useDeviceType()
  const [desktopViewedCategory, setDesktopViewedCategory] = useState({ name: null, items: [] })

  const handleGenerateTemplate = () => {
    setData(oldData => ({ ...oldData, expenses: defaultExpenses }))
  }

  const [percentageOfBudget, setPercentageOfBudget] = useState(0)
  const [noOfTransactions, setNoOfTransactions] = useState(0)

  useEffect(() => {
    setNoOfTransactions(desktopViewedCategory?.items?.length)
    //TODO check this
    if (desktopViewedCategory && desktopViewedCategory.items) {
      setPercentageOfBudget(convertAndCalculatePercentageOfTotal(desktopViewedCategory.items, data.mainCurrency, data.currencyTable, data.budget))
    }
  }, [desktopViewedCategory.items])

  useEffect(() => {
    if (data?.expenses) {
      setDesktopViewedCategory(oldValue => {
        return { name: oldValue.name, items: data.expenses[oldValue.name] }
      })
    }

  }, [data.expenses])


  if (device.type == 'mobile') {
    return (<TransactionsContainerMobile data={data} countTransactions={countTransactions} getColorForCategory={getColorForCategory} percentageOfBudget={percentageOfBudget} noOfTransactions={noOfTransactions} handleGenerateTemplate={handleGenerateTemplate} />)
  }

  return (<TransactionsContainerDesktop data={data} countTransactions={countTransactions} getColorForCategory={getColorForCategory} percentageOfBudget={percentageOfBudget} noOfTransactions={noOfTransactions} handleGenerateTemplate={handleGenerateTemplate} desktopViewedCategory={desktopViewedCategory} setDesktopViewedCategory={setDesktopViewedCategory}/>)

}

export default TransactionsContainer