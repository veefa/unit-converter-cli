"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
// Conversion data (quick hack with string-any typing)
const conversions = {
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
        celsiusToFahrenheit: (c) => (c * 9) / 5 + 32,
        fahrenheitToCelsius: (f) => ((f - 32) * 5) / 9,
    },
};
// Generic converter function (for length & weight)
const convertUnit = (amount, fromUnit, toUnit, type) => {
    const unitType = conversions[type];
    if (unitType && unitType[fromUnit] && unitType[toUnit]) {
        return (amount * unitType[toUnit]) / unitType[fromUnit];
    }
    console.log("❌ Invalid units provided.");
    return null;
};
// Temperature converter function (handles formulas)
const convertTemperature = (amount, fromUnit, toUnit) => {
    const conversionKey = `${fromUnit}To${toUnit}`;
    if (conversions.temperature[conversionKey]) {
        return conversions.temperature[conversionKey](amount);
    }
    console.log("❌ Invalid temperature conversion.");
    return null;
};
// CLI for user input
const startConverterCLI = () => __awaiter(void 0, void 0, void 0, function* () {
    // Ask user what type of conversion
    const { type } = yield inquirer_1.default.prompt([
        {
            type: "list",
            name: "type",
            message: "Choose the type of conversion:",
            choices: ["length", "weight", "temperature"],
        },
    ]);
    // Ask for the amount and units
    const { amount, fromUnit, toUnit } = yield inquirer_1.default.prompt([
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
    let result;
    // Check if temperature or regular unit conversion
    if (type === "temperature") {
        result = convertTemperature(numericAmount, fromUnit.toLowerCase(), toUnit.toLowerCase());
    }
    else {
        result = convertUnit(numericAmount, fromUnit.toLowerCase(), toUnit.toLowerCase(), type);
    }
    // Show the result
    if (result !== null) {
        console.log(`✅ Result: ${numericAmount} ${fromUnit} = ${result.toFixed(2)} ${toUnit}`);
    }
    else {
        console.log("❌ Conversion failed. Check your units.");
    }
});
// Start the CLI app
startConverterCLI();
