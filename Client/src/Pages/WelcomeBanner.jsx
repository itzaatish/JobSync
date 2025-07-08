import React, { useEffect, useState } from "react";
import "./WelcomeBanner.css"; // we'll define the styles below

const WelcomeBanner = ({ userName }) => {
  const fullText = `Weelcome ${userName.name.split(" ")[0] || `there`}, What is on your mind Today`;
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText((prev) => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 45); // Typing speed (ms)
    return () => clearInterval(typingInterval); // cleanup
  }, [userName]);

  return (
    <h2 className="welcome-text">
      {displayedText}
    </h2>
  );
};

export default WelcomeBanner;
