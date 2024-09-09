import React from 'react';

const CurrencyTable = ({currencyTable}) => {
    currencyTable = {
        EUR: { RON: 4.973, USD: 1.083 },
        USD: { EUR: 0.923, RON: 4.598 },
        RON: { EUR: 0.201, USD: 0.217 }
    };

    const currencies = ["EUR", "RON", "USD"];

   
    return (
      <div className="flex justify-center w-full">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                  <tr>
                      <th className="p-4"></th>
                      {currencies.map(currency => (
                          <th key={currency} className="p-4 text-gray-600 font-medium text-lg">{currency}</th>
                      ))}
                  </tr>
              </thead>
              <tbody>
                  {currencies.map(rowCurrency => (
                      <tr key={rowCurrency} className="border-t border-gray-200">
                          <td className="p-4 font-medium text-gray-600">{rowCurrency}</td>
                          {currencies.map(colCurrency => (
                              <td key={colCurrency} className="p-4 text-gray-800">
                                  {currencyTable[rowCurrency][colCurrency] || '-'}
                              </td>
                          ))}
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
  )
}



export default CurrencyTable;
