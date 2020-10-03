let url = "https://api.worldbank.org/v2/country/"

let randomCountryElement = document.querySelector('#random-country')
let userAnswerElement = document.querySelector("#user-answer")
let submitButton = document.querySelector("#submit-answer")         // for Check Answer button
let resultTextElement = document.querySelector('#result')
let playAgainButton = document.querySelector("#play-button")

// TODO finish the script to challenge the user about their knowledge of capital cities.
// An array of country codes is provided in the countries.js file. 
// Your browser treats all JavaScript files as one big file,
// organized in the order of the script tags so the countriesAndCodes array is available to this script.

console.log(countriesAndCodes)      // You don't need to log countriesAndCodes - just proving it is available
console.log(`There are ${countriesAndCodes.length} countries & codes in the array.`)

// Creating empty variables
let randomCountryIndex
let countryName
let countryCode         // key: alpha-2
let capital
let userAnswerGuess

function randomCountrySelector() 
{
    // TODO when the page loads, select an element at random from the countriesAndCodes array
    randomCountryIndex = Math.floor(Math.random() * countriesAndCodes.length)
    console.log(`The random array index is: ${randomCountryIndex}`)

    countryName = countriesAndCodes[randomCountryIndex].name
    countryCode = countriesAndCodes[randomCountryIndex]["alpha-2"]
    console.log(`The country code for ${countryName}: ${countryCode}`)

    // TODO display the country's name in the randomCountryElement
    randomCountryElement.innerHTML = `${countryName}`
    resultTextElement.innerHTML = ` `
}

// TODO add a click event handler to the submitButton.  When the user clicks the button,
//  * read the text from the userAnswerElement 
//  * Use fetch() to make a call to the World Bank API with the two-letter country code (from countriesAndCodes, example 'CN' or 'AF')
//  * Verify no errors were encountered in the API call. If an error occurs, display an alert message. 
//  * If the API call was successful, extract the capital city from the World Bank API response.
//  * Compare it to the user's answer. 
//      You can decide how correct you require the user to be. At the minimum, the user's answer should be the same
//      as the World Bank data - make the comparison case insensitive.
//      If you want to be more flexible, include and use a string similarity library such as https://github.com/hiddentao/fast-levenshtein 
//  * Finally, display an appropriate message in the resultTextElement to tell the user if they are right or wrong. 
//      For example "Correct! The capital of Germany is Berlin" or "Wrong - the capital of Germany is not G, it is Berlin"

function fetching() 
{
    userAnswerGuess = userAnswerElement.value.trim().toLowerCase()

    // fetch returns promise
    fetch(`${url}${countryCode}?format=json`)
        .then((res) => 
        {
            // process response into JSON, whatever is returned from here goes into issData
            return res.json()                       // res.json also returns a promise
        })
        .then((worldBankData) => 
        {
            console.log(worldBankData)              // display data on web page
            console.log(`World Bank Data for ${countryName}:`)

            capital = worldBankData[1][0].capitalCity
            console.log(`The Capital of ${countryName} is ${capital}`)

            // if the user has not entered an answer
            if(userAnswerGuess === "") 
            {
                console.log(`User did not enter an answer.`)
                resultTextElement.innerHTML = `No answer: The capital of ${countryName} is ${capital}`
            }
            // if the user guesses correctly
            else if(userAnswerGuess === capital.toLowerCase()) 
            {
                console.log(`User guess is correct. ${userAnswerGuess === capital.toLowerCase()}`)
                resultTextElement.innerHTML = `Correct! The capital of ${countryName} is ${capital}`
            }
            else 
            {
                console.log(`User guess is incorrect. ${userAnswerGuess === capital.toLowerCase()}`)
                resultTextElement.innerHTML = `Wrong - the capital of ${countryName} is not ${userAnswerGuess}, it is ${capital}`
            }
        })
        .catch((err) => 
        {
            alert("Error: " + err)
            console.log("Error", err)
        })
}

randomCountrySelector()

// When user clicks the check answer button
submitButton.addEventListener("click", function() {
    fetching()
})

// TODO finally, connect the play again button. Clear the user's answer, select a new random country,
// display the country's name, handle the user's guess. If you didn't use functions in the code you've
// already written, you should refactor your code to use functions to avoid writing very similar code twice.
playAgainButton.addEventListener("click", function() {
    userAnswerElement.value = ""
    randomCountrySelector()         // callback function
})


// Note: The World Bank API does not have a capital city for Hong Kong (hk)
// https://api.worldbank.org/v2/country/hk?format=json