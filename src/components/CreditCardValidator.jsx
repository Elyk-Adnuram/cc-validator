//import various hooks and data to be used in this component
import { useState, useEffect } from "react";
import { countriesData } from "../data/countriesData";
import { monthsData } from "../data/monthsData";
import { yearsData } from "../data/yearsData";
import BannedCountries from "./BannedCountries";

export default function CreditCardValidator() {
  const bannedCountriesStored = sessionStorage.getItem("bannedCountriesStored");
  const creditCardData = sessionStorage.getItem("creditCardData");
  //saving credit card info into state
  const [creditCardInfo, setCreditCardInfo] = useState({
    country: "Afghanistan",
    credit_card_number: "0",
    credit_card_expiry_month: "0",
    credit_card_expiry_year: "0",
    credit_card_cvv: "0",
    nameOnCard: "John Doe",
    validated: false,
  });
  //keeping track of credit card info after being submitted into form
  const [savedCreditCardInfo, setSavedCreditCardInfo] = useState([]);

  useEffect(() => {
    sessionStorage.setItem("creditCardData", JSON.stringify(savedCreditCardInfo));
  }, [savedCreditCardInfo]);

  // function to clear the various input fields after credit card info is submitted
  function clearFields() {
    setCreditCardInfo({
      country: "",
      credit_card_number: "",
      credit_card_expiry_month: "",
      credit_card_expiry_year: "",
      credit_card_cvv: "",
      nameOnCard: "",
      validated: false,
    });
  }

  //manage the state of the credit card details entered
  function handleChange(event) {
    //destructuring of event.target
    const { name, value } = event.target;
    setCreditCardInfo((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  }
  //checks if the user has inserted a card number which already exists
  function checkDuplicateCards(credit_card_number) {
    if (creditCardData.includes(credit_card_number)) {
      alert("Duplicate credit card number");
      creditCardInfo.validated = false;
    }
  }
  // function to check the CC expiry date
  function validateExpiryDate(credit_card_expiry_month, credit_card_expiry_year) {
    //obtain current date
    const date = new Date();
    let currentMonth = date.getMonth() + 1;
    let currentYear = date.getFullYear();
    if (credit_card_expiry_month < currentMonth && credit_card_expiry_year < currentYear) {
      alert("Please enter a valid expiry dates");
      creditCardInfo.validated = false;
    } else if (credit_card_expiry_year < currentYear) {
      alert("Please enter a valid credit card year");
      creditCardInfo.validated = false;
    }
  }

  // function to validate the CVV field
  function validateCVV(credit_card_cvv) {
    //regular expression to check if CVV is 3 or 4 digits & between 0 and 9
    const cvvRegex = new RegExp(/^[0-9]{3,4}$/);
    //if CVV does not meet below conditions user will be informed to enter a valid CVV
    if (
      !cvvRegex.test(credit_card_cvv) ||
      credit_card_cvv === null ||
      credit_card_cvv === undefined
    ) {
      alert("Please enter a 3 or 4 digit CVV");
      creditCardInfo.validated = false;
    }
  }

  //function to validate the country field
  function validateCountry(country) {
    if (
      country === "" ||
      country === null ||
      country == undefined ||
      bannedCountriesStored.includes(country)
    ) {
      alert("This credit card is banned. Please select alternative country");
      creditCardInfo.validated = false;
    } else {
      creditCardInfo.validated = true;
    }
  }

  //validate card name
  function validateName(nameOnCard) {
    //reg expression to ensure no digits are entered by user
    const nameRegex = new RegExp(/[0-9]$/);
    if (nameRegex.test(nameOnCard) || nameOnCard === "" || nameOnCard === null) {
      alert("Please enter valid name on card");
      creditCardInfo.validated = false;
    } else {
      creditCardInfo.validated = true;
    }
  }

  function validateCardNumber(credit_card_number) {
    //regex to check if card is valid Mastercard
    const masterCardRegex = new RegExp(
      /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/
    );
    //regex to check if card is valid American Express card
    const americanExpressRegex = new RegExp(/^3[47][0-9]{13}$/);
    //regex to check if card is valid Visa card
    const visaRegex = new RegExp(/^4[0-9]{12}(?:[0-9]{3})?$/);
    //regex to check if card is valid Discover card
    const discoverRegex = new RegExp(
      /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/
    );
    //regex to check if card is valid Maestro card
    const maestroRegex = new RegExp(
      /^(5018|5081|5044|5020|5038|603845|6304|6759|676[1-3]|6799|6220|504834|504817|504645)[0-9]{8,15}$/
    );
    //regex to check if card is valid JCB card
    const jcbRegex = new RegExp(/^(?:2131|1800|35[0-9]{3})[0-9]{11}$/);
    //regex to check if card is valid Diners club card
    const dinersclubRegex = new RegExp(/^3(?:0[0-5]|[68][0-9])[0-9]{11}$/);
    //regex to check if card number entered is a valid number
    const validNumberRegex = new RegExp(/^[0-9]{13,19}$/);

    if (masterCardRegex.test(credit_card_number)) {
      alert("Valid Mastercard Number ");
    } else if (americanExpressRegex.test(credit_card_number)) {
      alert("Valid American Exp card number");
    } else if (visaRegex.test(credit_card_number)) {
      alert("Valid Visa card number");
    } else if (discoverRegex.test(credit_card_number)) {
      alert("Valid Discover card number");
    } else if (maestroRegex.test(credit_card_number)) {
      alert("Valid Maestro card number");
    } else if (jcbRegex.test(credit_card_number)) {
      alert("Valid JCB card number");
    } else if (dinersclubRegex.test(credit_card_number)) {
      alert("Valid Diners Club card number");
    } else if (!validNumberRegex.test(credit_card_number)) {
      alert("Please enter valid card number");
      creditCardInfo.validated = false;
    } else {
      alert("Valid card number entered");
      creditCardInfo.validated = true;
    }
  }
  //function which calls all other functions upon click of validate button
  function validateCreditCard(e) {
    e.preventDefault();
    validateCardNumber(creditCardInfo.credit_card_number, creditCardInfo.country);
    validateName(creditCardInfo.nameOnCard);
    validateCountry(creditCardInfo.country);
    validateExpiryDate(
      creditCardInfo.credit_card_expiry_month,
      creditCardInfo.credit_card_expiry_year
    );
    validateCVV(creditCardInfo.credit_card_cvv);
    checkDuplicateCards(creditCardInfo.credit_card_number);
    setSavedCreditCardInfo((prevState) => [...prevState, creditCardInfo]);
    clearFields();
  }

  return (
    <main className="container">
      <BannedCountries />
      <form className="card-info-form" onSubmit={validateCreditCard}>
        <h3 className="margin-top">Enter credit card details</h3>
        <label htmlFor="nameOnCard">Name on Card</label>
        <input
          value={creditCardInfo.nameOnCard}
          onChange={handleChange}
          name="nameOnCard"
          placeholder="Please enter name"
          type="text"
          maxLength="19"
          required
        />

        <label htmlFor="country">Choose a country</label>
        <select
          name="country"
          id="country"
          value={creditCardInfo.country}
          onChange={handleChange}
          required
        >
          {countriesData.map((country) => {
            return (
              <option key={crypto.randomUUID()} value={country}>
                {country}
              </option>
            );
          })}
        </select>

        <label htmlFor="credit_card_number">Credit Card Number</label>
        <input
          value={creditCardInfo.credit_card_number}
          onChange={handleChange}
          name="credit_card_number"
          placeholder="1234 5678 4321 8765"
          type="number"
          maxLength="19"
          required
        />

        <label htmlFor="credit_card_expiry_month">Expiry Month</label>
        <select
          value={creditCardInfo.credit_card_expiry_month}
          onChange={handleChange}
          name="credit_card_expiry_month"
          type="number"
          required
        >
          {monthsData.map((month) => {
            return (
              <option key={crypto.randomUUID()} value={month}>
                {month}
              </option>
            );
          })}{" "}
        </select>

        <label htmlFor="credit_card_expiry_year">Expiry Year</label>
        <select
          value={creditCardInfo.credit_card_expiry_year}
          onChange={handleChange}
          name="credit_card_expiry_year"
          type="number"
          required
        >
          {yearsData.map((year) => {
            return (
              <option key={crypto.randomUUID()} value={year}>
                {year}
              </option>
            );
          })}
        </select>

        <label htmlFor="credit_card_cvv">CVV/CVC</label>
        <input
          value={creditCardInfo.credit_card_cvv}
          onChange={handleChange}
          min="3"
          name="credit_card_cvv"
          placeholder="123"
          type="number"
          required
        />

        <button className="validate-btn">Validate Credit Card</button>
      </form>
    </main>
  );
}
