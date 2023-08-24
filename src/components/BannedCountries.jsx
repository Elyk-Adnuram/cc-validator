import { useState, useEffect } from "react";
import { countriesData } from "../data/countriesData";
import "../App.css";

export default function BannedCountries() {
  //creating state to hold the banned countries.
  const [bannedCountries, setBannedCountries] = useState(["Afghanistan"]);

  //saving the banned countries to session storage
  useEffect(() => {
    sessionStorage.setItem("bannedCountriesStored", JSON.stringify(bannedCountries));
  }, [bannedCountries]);

  return (
    <div className="bannedComponent">
      <form>
        <label htmlFor="countries">
          <h3 className="margin-top">Select countries to configure banned country list</h3>
          <select
            multiple={true}
            name="countries"
            id="countries"
            value={bannedCountries}
            size="5"
            required
            onChange={(e) => {
              const options = [...e.target.selectedOptions];
              const values = options.map((option) => option.value);
              setBannedCountries(values);
            }}
          >
            {countriesData.map((country) => {
              return <option key={crypto.randomUUID()}>{country}</option>;
            })}
          </select>
        </label>
      </form>

      <h3 className="margin-top">Current banned countries</h3>
      <p>{bannedCountries.join(", ")}</p>
    </div>
  );
}
