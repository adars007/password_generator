import { useState, useCallback, useEffect } from "react";
import "./App.css";
import { useRef } from "react";

function App() {
  // useState
  const [strength, setStrength] = useState("");
  const [length, setLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false);
  const [password, setPassword] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const calculateStrength = useCallback(() => {
    let strengthValue = 0;

    // Checking password complexity
    if (/[A-Z]/.test(password)) strengthValue += 1; // Uppercase letters
    if (/[a-z]/.test(password)) strengthValue += 1; // Lowercase letters
    if (/[0-9]/.test(password)) strengthValue += 1; // Numbers
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password))
      strengthValue += 1; // Special characters

    // Password length
    if (password.length >= 12) strengthValue += 1;

    // Update the strength state based on strengthValue
    if (strengthValue <= 2) {
      setStrength("Weak");
    } else if (strengthValue === 3) {
      setStrength("Moderate");
    } else if (strengthValue >= 4) {
      setStrength("Strong");
    }
  }, [password]);

  // useCallBack
  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    if (numberAllowed) str += "0123456789";
    if (charAllowed) str += "!@#$%^&*_-+={}[]~`";

    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length + 1);
      pass += str.charAt(char);
    }
    setPassword(pass);
  }, [length, numberAllowed, charAllowed, setPassword]);

  // useEffect
  useEffect(() => {
    passwordGenerator();
  }, [length, numberAllowed, charAllowed, passwordGenerator]);

  const passwordRef = useRef(null);
  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, length);
    window.navigator.clipboard.writeText(password);
  }, [password]);

  const startExpiryCountdown = () => {
    setTimeout(() => {
      setPassword("Password Expired, generate a new one!");
      setIsExpired(true);
    }, 3000);
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <>
      <div className=" w-full max-w-lg mx-auto shadow-md rounded-lg px-4 py-3 my-5 text-orange-500 bg-gray-700 ">
        <h1 className="text-white text-center mx-5 ">Password Generator</h1>
        <div className="flex shadow rounded-lg overflow-hidden mb-4">
          <input
            type="text"
            value={password}
            className="outline-none w-full py-1 px-3"
            placeholder="password"
            readOnly
            ref={passwordRef}
          />
          <button
            className="outline-none bg-blue-700 text-white px-3 py-0.5 shrink-0"
            onClick={copyPasswordToClipboard}
          >
            Copy
          </button>
        </div>
        <div className="flex flex-row outline-none  mb-1">
          {/* Password Strength Button */}
          <div className="flex mb-2 items-center">
            <button
              className="outline-none bg-green-700 text-white px-3 py-1 rounded"
              onClick={calculateStrength}
            >
              Measure Strength
            </button>
            <span className="ml-1 text-white">Strength: {strength}</span>
          </div>
          <div className="flex mb-2 items-center">
            <button
              className={`mt-4 px-4 py-2 my-4 ml-2 text-white rounded-lg ${
                isExpired ? "bg-red-500" : "bg-green-500"
              }`}
              onClick={startExpiryCountdown}
            >
              {isExpired ? "Password Expired" : "Start Expiry Countdown"}
            </button>
          </div>
        </div>

        <div className="flex text-sm gap-x-2">
          <div className="flex items-center gap-x-1">
            <input
              type="range"
              min={6}
              max={20}
              value={length}
              className="cursor-pointer"
              onChange={(e) => {
                setLength(e.target.value);
              }}
            />
            <label>Length:{length}</label>
          </div>
          <div className="flex items-center gap-x-1">
            <input
              type="checkbox"
              defaultChecked={numberAllowed}
              id="numberInput"
              onChange={() => {
                setNumberAllowed((prev) => !prev);
              }}
            />
            <label htmlFor="numberInput">Numbers</label>
          </div>
          <div className="flex items-center gap-x-1">
            <input
              type="checkbox"
              defaultChecked={charAllowed}
              id="charInput"
              onChange={() => {
                setCharAllowed((prev) => !prev);
              }}
            />
            <label htmlFor="charInput">Character</label>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
