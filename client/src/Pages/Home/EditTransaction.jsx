import react, { useState } from 'react'

const EditTransaction = ({closeModal}) => {

  const [expenseName, setExpenseName] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('EUR');


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded shadow-lg w-96">
      <h2 className="text-xl mb-4">Edit Transaction</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="expenseName">
          Expense Name
        </label>
        <input
          type="text"
          id="expenseName"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="amount">
          Amount
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="currency">
          Currency
        </label>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="RON">RON</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          onClick={closeModal}
          className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
        >
          Cancel
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded" >
          Save
        </button>
      </div>
    </div>
  </div>
  )
}

export default EditTransaction