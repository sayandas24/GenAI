export function sum({ a, b }) {
  return a + b;
}

export function getWeather({ location }) {
  const weatherData = {
    'London': 'Rainy, 10°C',
    'New York': 'Sunny, 20°C',
    'Tokyo': 'Cloudy, 15°C',
    'Paris': 'Sunny, 18°C'
  };
  return weatherData[location] || `Unknown weather for ${location}.`;
}

export function isPrime({ num }) {
  if (num <= 1) return false
  if (num === 2) return true

  if (num % 2 === 0) return false


  const limit = Math.sqrt(num);
  for (let i = 3; i <= limit; i += 2) {
    if (num % i === 0) return false;
  }
  return true;
}

export const toolsDeclaration = [{
  functionDeclarations: [
    {
      name: "sum",
      description: "Returns the sum of two numbers.",
      parameters: {
        type: "OBJECT",
        properties: {
          a: {
            type: "NUMBER",
            description: "The first number."
          },
          b: {
            type: "NUMBER",
            description: "The second number."
          }
        },
        required: ["a", "b"]
      }
    },
    {
      name: "getWeather",
      description: "Gets the current weather for a specific location.",
      parameters: {
        type: "OBJECT",
        properties: {
          location: {
            type: "STRING",
            description: "The city name to check the weather for, e.g., London, New York"
          }
        },
        required: ["location"]
      }
    }
    ,
    {
      name: 'isPrime',
      description: 'Gets a number as argument and checks if the number prime or not, it returns true of false',
      parameters: {
        type: 'OBJECT',
        properties: {
          num: {
            type: 'NUMBER',
            description: 'Gets a number and checks if prime or not'
          }
        }
      }
    }
  ]
}];

export const executableTools = {
  sum: sum,
  getWeather: getWeather,
  isPrime: isPrime
};