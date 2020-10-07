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

console.log(countriesAndCodes)      // debug: You don't need to log countriesAndCodes - just proving it is available
console.log(`There are ${countriesAndCodes.length} countries & codes in the array.`)        // debug

// Creating empty variables
let randomCountryIndex
let countryName
let countryCode         // key: alpha-2 from the World Bank API
let capital
let userAnswerGuess

function randomCountrySelector() 
{
    // TODO when the page loads, select an element at random from the countriesAndCodes array
    randomCountryIndex = Math.floor(Math.random() * countriesAndCodes.length)
    console.log(`The random array index is: ${randomCountryIndex}`)                 // debug

    countryName = countriesAndCodes[randomCountryIndex].name
    countryCode = countriesAndCodes[randomCountryIndex]["alpha-2"]
    console.log(`The country code for ${countryName}: ${countryCode}`)              // debug

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

function fetching() {
    userAnswerGuess = userAnswerElement.value.trim().toLowerCase()

    fetch(`${url}${countryCode}?format=json`)               // fetch returns promise
        .then((res) => {
            // process response into JSON, whatever is returned from here goes into worldBankData
            return res.json()                                    // res.json returns a promise
        })
        .then((worldBankData) => {
            console.log(worldBankData)                           // debug: display all API data on web page
            console.log(`World Bank Data for ${countryName}:`)   // debug: display the random country generated

            capital = worldBankData[1][0].capitalCity
            console.log(`The Capital of ${countryName} is ${capital}`)      // debug

            // display appropriate results for the user's answer
            // if the user guesses correctly
            if(userAnswerGuess === capital.toLowerCase())
            {
                if(userAnswerGuess === "" && capital === "")
                {
                    console.log(`There is no capital for this country. User guess is correct.`)                 // debug
                    resultTextElement.innerHTML = `Correct! ${countryName} does not have a capital.`
                }
                else
                {
                    console.log(`User guess is correct. ${userAnswerGuess === capital.toLowerCase()}`)          // debug
                    resultTextElement.innerHTML = `Correct! The capital of ${countryName} is ${capital}.`
                }
            }
            // if the user guesses incorrectly
            else // if(userAnswerGuess != capital.toLowerCase())
            {
                // if the user has entered an answer & there is no capital
                if(userAnswerGuess != "" && capital === "")
                {
                    console.log(`There is no capital for this country. User guess is incorrect.`)               // debug
                    resultTextElement.innerHTML = `Wrong! The capital of ${countryName} is not ${userAnswerGuess}. 
                                                  ${countryName} does not have a capital.`
                }
                // if the user has not entered an answer
                else if(userAnswerGuess === "")
                {
                    console.log(`User did not enter an answer.`)                                                // debug
                    resultTextElement.innerHTML = `No answer: The capital of ${countryName} is ${capital}.`
                }
                // if the user's answer does not match the capital
                else
                {
                    console.log(`User guess is incorrect. ${userAnswerGuess === capital.toLowerCase()}`)        // debug
                    resultTextElement.innerHTML = `Wrong! The capital of ${countryName} is not ${userAnswerGuess}, it is ${capital}.`
                }
            }

            if(countryName === capital)
            {
                resultTextElement.innerHTML += `<br><br>This is one of those countries that has the same name for the capital!`
            }
        })
        .catch((err) => {
            alert("Error: " + err)
            console.log("Error", err)                                                                           // debug
        })
}

randomCountrySelector()             // callback function

// When user clicks the check answer button
submitButton.addEventListener("click", function() {
    fetching()                      // callback function
})

// TODO finally, connect the play again button. Clear the user's answer, select a new random country,
// display the country's name, handle the user's guess. If you didn't use functions in the code you've
// already written, you should refactor your code to use functions to avoid writing very similar code twice.
playAgainButton.addEventListener("click", function() {
    userAnswerElement.value = ""
    randomCountrySelector()         // callback function
})

// TODO add event listener to click the check answer button first and
//  second click for play again button when the enter key is pressed
window.addEventListener("keyup", function(event) {
    if(event.key === "Enter" || event.keyCode === 13)
    {
        // store the active elements in an array
        let inputElements = [userAnswerElement, submitButton]

        if(inputElements.includes(document.activeElement))
        {
            // click the check answer button if user presses the enter key
            submitButton.click()
            // shift the focus on the play again button
            playAgainButton.focus()
        }
        // if the play again button is in focus when the enter key was pressed
        else if(document.activeElement === playAgainButton)
        {
            // shift the focus onto the user input box
            userAnswerElement.focus()
        }
    }
})




// Note: The following countries do not have capital cities:
// Example: https://api.worldbank.org/v2/country/hk?format=json
// Hong Kong, Israel, Palestine, Macao