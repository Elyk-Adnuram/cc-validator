//importing of required components and libraries
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import CreditCardValidator from "./components/CreditCardValidator";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route exact path="/" element={<CreditCardValidator />} />
      </Routes>
    </>
  );
}
