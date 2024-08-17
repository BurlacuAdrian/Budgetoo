export const formatCurrency = (number, currencyName = "EUR") => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyName,
    minimumFractionDigits: 0,
  }).format(number);
};

export const convertAndFormatCurrency = (amount, currencyName, mainCurrency, currencyTable) => {
  let convertedAmount;

  // Step 1: Check if conversion is needed
  if (currencyName === mainCurrency) {
    convertedAmount = amount; // No conversion needed
  } else {
    // Step 2: Check if the conversion is possible
    console.log()
    if (!currencyTable[currencyName] || !currencyTable[currencyName][mainCurrency]) {
      throw new Error(`Conversion rate from ${currencyName} to ${mainCurrency} not found.`);
    }

    // Step 3: Convert the amount to the main currency
    const conversionRate = currencyTable[currencyName][mainCurrency];
    convertedAmount = amount * conversionRate;
  }

  // Step 4: Format the converted (or non-converted) amount in the format of the main currency
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: mainCurrency,
    minimumFractionDigits: 0,
  }).format(convertedAmount);
};

export const sumAndConvertItems = (items, mainCurrency, currencyTable) => {
  let sum = 0;

  items.forEach(item => {
    const amount = item[1];
    const currency = item[2];

    // Check if amount is a valid number
    const validAmount = isNaN(+amount) ? 0 : +amount;

    // Check if currency conversion is needed
    let convertedAmount;
    if (currency === mainCurrency) {
      convertedAmount = validAmount; // No conversion needed
    } else {
      // Check if the conversion is possible
      if (!currencyTable[currency] || !currencyTable[currency][mainCurrency]) {
        console.warn(`Conversion rate from ${currency} to ${mainCurrency} not found.`)
        return 0
        // throw new Error(`Conversion rate from ${currency} to ${mainCurrency} not found.`);
      }

      // Convert the amount to the main currency
      const conversionRate = currencyTable[currency][mainCurrency];
      convertedAmount = validAmount * conversionRate;
    }

    // Add the converted amount to the sum
    sum += convertedAmount;
  });

  return sum;
};

export const sumAndConvertExpenses = (expenses, mainCurrency, currencyTable) => {
  let totalSum = 0;

  for (const category in expenses) {
    expenses[category].forEach(item => {
      const amount = item[1];
      const currency = item[2];

      // Check if amount is a valid number
      const validAmount = isNaN(+amount) ? 0 : +amount;

      // Check if currency conversion is needed
      let convertedAmount;
      if (currency === mainCurrency) {
        convertedAmount = validAmount; // No conversion needed
      } else {
        // Check if the conversion is possible
        if (!currencyTable[currency] || !currencyTable[currency][mainCurrency]) {
          console.warn(`Conversion rate from ${currency} to ${mainCurrency} not found.`)
          throw new Error(`Conversion rate from ${currency} to ${mainCurrency} not found.`);
        }

        // Convert the amount to the main currency
        const conversionRate = currencyTable[currency][mainCurrency];
        convertedAmount = validAmount * conversionRate;
      }

      // Add the converted amount to the total sum
      totalSum += convertedAmount;
    });
  }

  return totalSum;
};



export const convertAndCalculatePercentageOfTotal = (items, mainCurrency, currencyTable, totalSpent) => {
  return (sumAndConvertItems(items, mainCurrency, currencyTable) * 100 / totalSpent).toFixed(0)
}


export const formatNumberNoCurrency = (number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    
  }).format(number);
};

export const getSVGForCategory = (category) => {
  switch (category) {
    case 'Housing':
      return './housing.svg'
    case 'Transportation':
      return './car.svg'
    case 'Food':
      return './utensils.svg'
    case 'Health':
      return './health.svg'
    case 'Entertainment':
      return './ticket.svg'
    case 'Personal':
      return './smile.svg'
    default:
      return 'cash-black.svg'
  }
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Function to get the month name by number
export function getMonthName(monthNumber) {
  if (monthNumber < 1 || monthNumber > 12) {
    return "Invalid month number";
  }
  return monthNames[monthNumber - 1];
}

export const getTransactionsCaption = (number) => {
  switch (number) {
    case 0:
      return 'No transactions'
    case 1:
      return '1 transaction'
    default:
      return `${number} transactions`
  }
}

