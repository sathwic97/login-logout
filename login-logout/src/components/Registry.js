import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const user_Regex = /^[A-z][A-z0-9-_]{3,23}$/;
const email_Regex = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/;
const mobileNumber_Regex = /^[0-9]\d{9}$/;

function Registry() {
  const userInput = useRef();
  const emailInput = useRef();
  const mobileNumberInput = useRef();
  const errorInput = useRef();
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [validUser, setValidUser] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [mobileNumber, setMobileNumber] = useState("");
  const [validMobileNumber, setValidMobileNumber] = useState(false);
  const [mobileNumberFocus, setMobileNumberFocus] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userInput.current.focus();
  }, []);

  useEffect(() => {
    setValidUser(user_Regex.test(user));
  }, [user]);

  useEffect(() => {
    setValidEmail(email_Regex.test(email));
  }, [email]);

  useEffect(() => {
    setValidMobileNumber(mobileNumber_Regex.test(mobileNumber));
  }, [mobileNumber]);

  useEffect(() => {
    setErrorMessage("");
  }, [user, email, mobileNumber]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userEntry = user_Regex.test(user);
    const emailEntry = email_Regex.test(email);
    const mobileNumberEntry = mobileNumber_Regex.test(mobileNumber);
    if (!userEntry || !emailEntry || !mobileNumberEntry) {
      setErrorMessage("Invalid Entry");
      return;
    }
    const head = new Headers();
    head.append("Content-Type", "application/json");

    const dataToSend = {
      user: user,
      email: email,
      mobileNumber: mobileNumber,
    };

    const rawData = await fetch("http://localhost:8777/login", {
      method: "POST",
      headers: head,
      body: JSON.stringify(dataToSend),
    });
    const convertedData = await rawData.json();
    if (convertedData.user === "admin") {
      navigate("/admin");
    } else {
      navigate("/home");
    }
  };
  return (
    <>
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <a href="#">Sign In</a>
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errorInput}
            className={errorMessage ? "errormessage" : "offscreen"}
            aria-live="assertive"
          >
            {errorMessage}
          </p>
          <h1>Login</h1>
          <form
            onSubmit={() => {
              handleSubmit();
            }}
          >
            <label htmlFor="username">
              Username:
              <FontAwesomeIcon
                icon={faCheck}
                className={validUser ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validUser || !user ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="username"
              ref={userInput}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
              aria-invalid={validUser ? "false" : "true"}
              aria-describedby="usernote"
              onFocus={() => {
                setUserFocus(true);
              }}
              onBlur={() => {
                setUserFocus(false);
              }}
            />
            <p
              id="usernote"
              className={
                userFocus && user && !validUser ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>

            <label htmlFor="email">
              Email:
              <FontAwesomeIcon
                icon={faCheck}
                className={validEmail ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validEmail || !email ? "hide" : "invalid"}
              />
            </label>
            <input
              type="email"
              id="email"
              ref={emailInput}
              required
              autoComplete="off"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
              aria-invalid={validEmail ? "false" : "true"}
              aria-describedby="emailnote"
              onFocus={() => {
                setEmailFocus(true);
              }}
              onBlur={() => {
                setEmailFocus(false);
              }}
            />
            <p
              id="emailnote"
              className={
                emailFocus && email && !validEmail
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must be a valid email.
              <br />
              Must begin with a letter.
            </p>

            <label htmlFor="mobilenumber">
              Mobile Number:
              <FontAwesomeIcon
                icon={faCheck}
                className={validMobileNumber ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={
                  validMobileNumber || !mobileNumber ? "hide" : "invalid"
                }
              />
            </label>
            <input
              type="number"
              required
              ref={mobileNumberInput}
              autoComplete="off"
              onChange={(e) => {
                setMobileNumber(e.target.value);
              }}
              aria-invalid={validMobileNumber ? "false" : "true"}
              value={mobileNumber}
              aria-describedby="mobilenote"
              onFocus={() => {
                setMobileNumberFocus(true);
              }}
              onBlur={() => {
                setMobileNumberFocus(false);
              }}
            />
            <p
              id="numbernote"
              className={
                mobileNumberFocus && mobileNumber && !validMobileNumber
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must contain ten digits.
              <br />
              Must be a valid mobile number.
            </p>

            <button
              disabled={
                !validUser || !validEmail || !validMobileNumber ? true : false
              }
            >
              Log In
            </button>
          </form>
        </section>
      )}
    </>
  );
}

export default Registry;
