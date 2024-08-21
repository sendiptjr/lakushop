// components/OTPInput.js
import React, { useState, useRef } from "react";

interface OTPInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
}
const OTPInput: React.FC<OTPInputProps> = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef(
    Array.from({ length }, () => React.createRef<HTMLInputElement>())
  );

  const handleInputChange = (value: any, index: any) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index === length - 1 && value.length > 1) {
      // Jika karakter pertama pada elemen terakhir diisi, gunakan hanya karakter pertama
      newOtp[index] = value.charAt(0);
    }
    // Move to the next input field
    const nextInputRef = inputRefs.current[index + 1];
    if (nextInputRef && nextInputRef.current) {
      nextInputRef.current.focus();
    }

    // Trigger onComplete when all input fields are filled
    if (!newOtp.includes("") && onComplete) {
      onComplete(newOtp.join(""));
    }
  };

  const handleInputKeyDown = (event: any, index: any) => {
    if (event.key === "Backspace" && index > 0 && !otp[index]) {
      // Move to the previous input field when backspace is pressed on an empty field
      const prevInputRef = inputRefs.current[index - 1];
      if (prevInputRef && prevInputRef.current) {
        prevInputRef.current.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };
  const handlePaste = (
    event: React.ClipboardEvent<HTMLInputElement>,
    index: number
  ) => {
    event.preventDefault(); // Prevent the default paste behavior

    const pastedData = event.clipboardData.getData("text");
    // console.log(JSON.stringify(pastedData));

    const newOtp = [...otp];

    for (let i = 0; i < length; i++) {
      newOtp[index + i] = pastedData[i] || "";
    }

    setOtp(newOtp);

    // Move focus to the next input field after a short delay
    setTimeout(() => {
      const nextInputRef = inputRefs.current[index + length];
      if (nextInputRef && nextInputRef.current) {
        nextInputRef.current.focus();
      }
    }, 0);

    // Trigger onComplete when all input fields are filled
    if (!newOtp.includes("") && onComplete) {
      onComplete(newOtp.join(""));
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      {otp.map((value, index) => (
        <input
          key={index}
          type="number"
          value={value}
          onChange={(e) => handleInputChange(e.target.value, index)}
          onKeyDown={(e) => handleInputKeyDown(e, index)}
          ref={inputRefs.current[index]}
          onPaste={(e) => handlePaste(e, index)}
          maxLength={1}
          style={{
            width: "2em",
            height: "2em",
            textAlign: "center",
            margin: "0 0.5em",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "1em",
            color: "black",
          }}
        />
      ))}
    </div>
  );
};

export default OTPInput;
