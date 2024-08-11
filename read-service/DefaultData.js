const defaultExpenses = {
    "Housing": [
      ["Rent", 1000, "EUR"],
      ["Utilities", 150, "EUR"]
    ],
    "Transportation": [
      ["Gas", 50, "EUR"],
      ["Public Transit Pass", 75, "EUR"]
    ],
    "Food": [
      ["Groceries", 300, "EUR"],
      ["Dining Out", 100, "EUR"]
    ],
    "Health": [
      ["Doctor Visit", 100, "EUR"],
      ["Gym Membership", 40, "EUR"]
    ],
    "Entertainment": [
      ["Movie Tickets", 30, "EUR"],
      ["Concert", 60, "EUR"]
    ],
    "Personal": [
      ["Clothing", 150, "EUR"],
      ["Gift", 50, "EUR"]
    ]
}

const defaultIncome = [
  ["Salary", 3000, "EUR"]
  ["Investments", 250, "EUR"]
]

var today = new Date()

const initialData = {
  year: today.getFullYear(),
  month: today.getMonth() + 1,
  budget: 3000,
  mainCurrency: "EUR",
  currencyTable: {
    "EUR": { "RON": 4.973, "USD": 1.083 },
    "USD": { "EUR": 0.923, "RON": 4.598 },
    "RON": { "EUR": 0.201, "USD": 0.217 }
  },
  expenses: {},
  income: [],
  email: "email@email.com",
  picture: "/"
};

module.exports = {defaultExpenses, defaultIncome, initialData}

