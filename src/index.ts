import inquirer from "inquirer";

// Define supported units using interfaces
interface ConversionRates {
  [unit: string]: number;
}

interface TemperatureConversion {
  celsiusToFahrenheit: (c: number) => number;
  fahrenheitToCelsius: (f: number) => number;
}

// Define unit conversion data
const conversions = {
  length: <ConversionRates>{
    meters: 1,
    kilometers: 0.001,
    miles: 0.000621371,
    feet: 3.28084,
  },
  weight: <ConversionRates>{
    grams: 1,
    kilograms: 0.001,
    pounds: 0.00220462,
  },
  temperature: <TemperatureConversion>{
    celsiusToFahrenheit: (c: number) => (c * 9) / 5 + 32,
    fahrenheitToCelsius: (f: number) => ((f - 32) * 5) / 9,
  },
};

// Define types for conversion categories
type ConversionType = "length" | "weight" | "temperature";

// Generic conversion function for length and weight
function convertUnit(
  amount: number,
  fromUnit: string,
  toUnit: string,
  type: ConversionType
): number | null  {
  const unitType = conversions[type];

  if (
    type === "temperature" ||
    !(fromUnit in unitType) ||
    !(toUnit in unitType)
  ) {
    console.log("Invalid units for this type.");
    return null;
  }

  return (amount * unitType[toUnit]) / unitType[fromUnit];
}
// Temperature-specific conversion function
function convertTemperature(amount: number, fromUnit: string, toUnit: string): number | null {
    if (fromUnit === "celsius" && toUnit === "fahrenheit") {
      return conversions.temperature.celsiusToFahrenheit(amount);
    } else if (fromUnit === "fahrenheit" && toUnit === "celsius") {
      return conversions.temperature.fahrenheitToCelsius(amount);
    }
  
    console.log("Invalid temperature conversion.");
    return null;
  }
  
  // CLI with inquirer
  async function startConverterCLI() {
    const { type } = await inquirer.prompt([
      {
        type: "list",
        name: "type",
        message: "Choose the type of conversion:",
        choices: ["length", "weight", "temperature"],
      },
    ]);
  
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
  
    if (type === "temperature") {
      result = convertTemperature(numericAmount, fromUnit.toLowerCase(), toUnit.toLowerCase());
    } else {
      result = convertUnit(numericAmount, fromUnit.toLowerCase(), toUnit.toLowerCase(), type as ConversionType);
    }
  
    if (result !== null) {
      console.log(`✅ Result: ${numericAmount} ${fromUnit} = ${result} ${toUnit}`);
    } else {
      console.log("❌ Conversion failed. Check your units.");
    }
  }
  
  // Run the CLI
  startConverterCLI();