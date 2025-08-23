import { useRef } from "react";
import CountryAutocomplete from "./CountryAutocomplete";

function UncontrolledForm() {
  const inputNameRef = useRef<HTMLInputElement>(null);
  const inputAgeRef = useRef<HTMLInputElement>(null);
  const inputEmailRef = useRef<HTMLInputElement>(null);
  const inputPassRef = useRef<HTMLInputElement>(null);
  const inputMatchRef = useRef<HTMLInputElement>(null);
  const inputMaleRef = useRef<HTMLInputElement>(null);
  const inputFemaleRef = useRef<HTMLInputElement>(null);
  const inputTCRef = useRef<HTMLInputElement>(null);
  const inputImageRef = useRef<HTMLInputElement>(null);
  const inputCountryRef = useRef<HTMLInputElement>(null!);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("Form values:");
    console.log("Name:", inputNameRef.current?.value);
    console.log("Age:", inputAgeRef.current?.value);
    console.log("Email:", inputEmailRef.current?.value);
    console.log("Password:", inputPassRef.current?.value);
    console.log("Retype:", inputMatchRef.current?.value);
    console.log("Gender:", inputMaleRef.current?.checked ? "male" : inputFemaleRef.current?.checked ? "female" : "");
    console.log("T&C accepted:", inputTCRef.current?.checked);
    console.log("Image:", inputImageRef.current?.files?.[0]?.name);
    console.log("Country:", inputCountryRef.current?.value);
  };

  return (
    <form className="wrapper-form" onSubmit={handleSubmit}>
      <h2 className="header-form">Uncontrolled Form</h2>
      <ul className="list-inputs">
        <li>
          <label htmlFor="name" className="label-input">Name</label>
          <input id="name" type="text" className="input-form" ref={inputNameRef} />
          <div className="error-massage">Must be first uppercased letter</div>
        </li>
        <li>
          <label htmlFor="age" className="label-input">Age</label>
          <input id="age" type="number" className="input-form" ref={inputAgeRef} />
          <div className="error-massage">Must be number, no negative values</div>
        </li>
        <li>
          <label htmlFor="email" className="label-input">Email</label>
          <input id="email" type="text" className="input-form" ref={inputEmailRef} />
          <div className="error-massage">Email must be valid</div>
        </li>
        <li>
          <label htmlFor="password" className="label-input">Password</label>
          <input id="password" type="password" className="input-form" ref={inputPassRef} />
          <div className="error-massage">1 number, 1 uppercased letter, 1 lowercased letter, 1 special character</div>
        </li>
        <li>
          <label htmlFor="repass" className="label-input">Retype password</label>
          <input id="repass" type="password" className="input-form" ref={inputMatchRef} />
          <div className="error-massage">Passwords don't match</div>
        </li>
        <li>
          <label className="label-input">Gender</label>
          <label>
            <input type="radio" name="gender" value="male" ref={inputMaleRef} /> Male
          </label>
          <label>
            <input type="radio" name="gender" value="female" ref={inputFemaleRef} /> Female
          </label>
          <div className="error-massage">You should choose gender</div>
        </li>
        <li>
          <label>
            <input type="checkbox" ref={inputTCRef} /> Accept terms & conditions
          </label>
          <div className="error-massage">You should accept</div>
        </li>
        <li>
          <label htmlFor="image" className="label-input">Image</label>
          <input id="image" type="file" className="input-form" ref={inputImageRef} />
          <div className="error-massage">You should upload image</div>
        </li>
        <li>
          <CountryAutocomplete inputRef={inputCountryRef} />
          <div className="error-massage">You should choose country</div>
        </li>
      </ul>
      <button type="submit">Submit</button>

    </form>
  );
}

export default UncontrolledForm;
