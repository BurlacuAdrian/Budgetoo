import react, { useEffect, useState } from 'react'

const EditBudget = ({closeModal, data}) => {

  const [amount, setAmount] = useState(data.budget || '');
  const [currency, setCurrency] = useState('EUR');

  const handleSaveButton = () => {

    data.API.saveBudget(amount)

    closeModal()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
    <div className="bg-white p-6 rounded shadow-lg w-96 z-20">
      <h2 className="text-xl mb-4">Edit budget for this month</h2>

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
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSaveButton}>
          Save
        </button>
      </div>
    </div>
  </div>
  )
}

export default EditBudget