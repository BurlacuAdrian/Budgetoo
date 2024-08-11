export const formatCurrency = (number, currencyName) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(number);
};

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

