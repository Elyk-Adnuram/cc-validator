import { useState, useCallback } from "react";
import { monthsData } from "../data/monthsData";
import { yearsData } from "../data/yearsData";
import PropTypes from "prop-types";

// Create a separate validation utility
const cardValidationPatterns = {
  masterCard:
    /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
  americanExpress: /^3[47][0-9]{13}$/,
  visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
  discover:
    /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/,
  maestro:
    /^(5018|5081|5044|5020|5038|603845|6304|6759|676[1-3]|6799|6220|504834|504817|504645)[0-9]{8,15}$/,
  jcb: /^(?:2131|1800|35[0-9]{3})[0-9]{11}$/,
  dinersClub: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
};

export default function CreditCardValidator({ onValidSubmit }) {
  const [errors, setErrors] = useState({});
  const [creditCardInfo, setCreditCardInfo] = useState({
    country: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    nameOnCard: "",
  });

  const validateCardNumber = useCallback((cardNumber) => {
    // Remove any spaces or special characters
    const cleanNumber = cardNumber.replace(/\D/g, "");

    // Check if the number matches any known card pattern
    for (const [cardType, pattern] of Object.entries(cardValidationPatterns)) {
      if (pattern.test(cleanNumber)) {
        return { isValid: true, cardType };
      }
    }

    return { isValid: false, error: "Invalid card number format" };
  }, []);

  const validateExpiryDate = useCallback((month, year) => {
    const currentDate = new Date();
    const cardDate = new Date(year, month - 1);

    if (cardDate < currentDate) {
      return { isValid: false, error: "Card has expired" };
    }
    return { isValid: true };
  }, []);

  const validateCVV = useCallback((cvv, cardType) => {
    const cvvLength = cvv.length;
    const isAmex = cardType === "americanExpress";
    const expectedLength = isAmex ? 4 : 3;

    if (cvvLength !== expectedLength || !/^\d+$/.test(cvv)) {
      return { isValid: false, error: `CVV must be ${expectedLength} digits` };
    }
    return { isValid: true };
  }, []);

  const validateName = useCallback((name) => {
    if (!name || name.length < 2 || /\d/.test(name)) {
      return { isValid: false, error: "Please enter a valid name" };
    }
    return { isValid: true };
  }, []);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setCreditCardInfo((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    setErrors((prev) => ({
      ...prev,
      [name]: null,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const newErrors = {};

      // Validate card number
      const cardValidation = validateCardNumber(creditCardInfo.cardNumber);
      if (!cardValidation.isValid) {
        newErrors.cardNumber = cardValidation.error;
      }

      // Validate expiry
      const expiryValidation = validateExpiryDate(
        creditCardInfo.expiryMonth,
        creditCardInfo.expiryYear
      );
      if (!expiryValidation.isValid) {
        newErrors.expiry = expiryValidation.error;
      }

      // Validate CVV
      const cvvValidation = validateCVV(creditCardInfo.cvv, cardValidation.cardType);
      if (!cvvValidation.isValid) {
        newErrors.cvv = cvvValidation.error;
      }

      // Validate name
      const nameValidation = validateName(creditCardInfo.nameOnCard);
      if (!nameValidation.isValid) {
        newErrors.nameOnCard = nameValidation.error;
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      // If we get here, the card is valid
      onValidSubmit({
        ...creditCardInfo,
        cardType: cardValidation.cardType,
      });
    },
    [
      creditCardInfo,
      validateCardNumber,
      validateExpiryDate,
      validateCVV,
      validateName,
      onValidSubmit,
    ]
  );

  return (
    <form className="card-info-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="nameOnCard">Name on Card</label>
        <input
          id="nameOnCard"
          name="nameOnCard"
          type="text"
          value={creditCardInfo.nameOnCard}
          onChange={handleChange}
          className={errors.nameOnCard ? "error" : ""}
          maxLength="70"
          required
        />
        {errors.nameOnCard && <span className="error-message">{errors.nameOnCard}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="cardNumber">Card Number</label>
        <input
          id="cardNumber"
          name="cardNumber"
          type="text"
          value={creditCardInfo.cardNumber}
          onChange={handleChange}
          className={errors.cardNumber ? "error" : ""}
          maxLength="19"
          required
        />
        {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="expiryMonth">Expiry Month</label>
          <select
            id="expiryMonth"
            name="expiryMonth"
            value={creditCardInfo.expiryMonth}
            onChange={handleChange}
            required
          >
            <option value="">Month</option>
            {monthsData.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="expiryYear">Expiry Year</label>
          <select
            id="expiryYear"
            name="expiryYear"
            value={creditCardInfo.expiryYear}
            onChange={handleChange}
            required
          >
            <option value="">Year</option>
            {yearsData.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      {errors.expiry && <span className="error-message">{errors.expiry}</span>}

      <div className="form-group">
        <label htmlFor="cvv">CVV/CVC</label>
        <input
          id="cvv"
          name="cvv"
          type="password"
          value={creditCardInfo.cvv}
          onChange={handleChange}
          className={errors.cvv ? "error" : ""}
          maxLength="4"
          required
        />
        {errors.cvv && <span className="error-message">{errors.cvv}</span>}
      </div>

      <button type="submit" className="validate-btn">
        Validate Credit Card
      </button>
    </form>
  );
}
CreditCardValidator.propTypes = {
  onValidSubmit: PropTypes.object,
};
