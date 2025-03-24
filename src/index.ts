import inquirer from "inquirer";

// Conversion data (quick hack with string-any typing)
const conversions: { [key: string]: any } = {
  length: {
    meters: 1,
    kilometers: 0.001,
    miles: 0.000621371,
    feet: 3.28084,
  },
  weight: {
    grams: 1,
    kilograms: 0.001,
    pounds: 0.00220462,
  },
  temperature: {
    celsiusToFahrenheit: (c: number) => (c * 9) / 5 + 32,
    fahrenheitToCelsius: (f: number) => ((f - 32) * 5) / 9,
  },
};

// Generic converter function (for length & weight)
const convertUnit = (
  amount: number,
  fromUnit: string,
  toUnit: string,
  type: string
): number | null => {
  const unitType = conversions[type];
  if (unitType && unitType[fromUnit] && unitType[toUnit]) {
    return (amount * unitType[toUnit]) / unitType[fromUnit];
  }
  console.log("❌ Invalid units provided.");
  return null;
};

// Temperature converter function (handles formulas)
const convertTemperature = (
  amount: number,
  fromUnit: string,
  toUnit: string
): number | null => {
  const conversionKey = `${fromUnit}To${toUnit}`;
  if (conversions.temperature[conversionKey]) {
    return conversions.temperature[conversionKey](amount);
  }
  console.log("❌ Invalid temperature conversion.");
  return null;
};

// CLI for user input
const startConverterCLI = async () => {
  // Ask user what type of conversion
  const { type } = await inquirer.prompt([
    {
      type: "list",
      name: "type",
      message: "Choose the type of conversion:",
      choices: ["length", "weight", "temperature"],
    },
  ]);

  // Ask for the amount and units
  const { amount, fromUnit, toUnit } = await inquirer.prompt([
    {
      type: "input",
      name: "amount",
      message: "Enter the amount:",
      validate: (input) => !isNaN(parseFloat(input)) || "Please enter a valid number",
    },
    {
      type: "input",
      name: "fromUnit",
      message: "Enter the 'from' unit:",
    },
    {
      type: "input",
      name: "toUnit",
      message: "Enter the 'to' unit:",
    },
  ]);

  const numericAmount = parseFloat(amount);
  let result: number | null;

  // Check if temperature or regular unit conversion
  if (type === "temperature") {
    result = convertTemperature(numericAmount, fromUnit.toLowerCase(), toUnit.toLowerCase());
  } else {
    result = convertUnit(numericAmount, fromUnit.toLowerCase(), toUnit.toLowerCase(), type);
  }

  // Show the result
  if (result !== null) {
    console.log(`✅ Result: ${numericAmount} ${fromUnit} = ${result.toFixed(2)} ${toUnit}`);
  } else {
    console.log("❌ Conversion failed. Check your units.");
  }
};

// Start the CLI app
startConverterCLI();