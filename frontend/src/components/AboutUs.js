import React from "react";
import Navbar from "./Navbar";

const AboutUs = () => (
  <div>
    <Navbar isLoggedIn={false} />
    <div style={styles.container}>
      <h1>About PaySmart</h1>
      <p>
        PaySmart is a secure and efficient international payment platform designed to make global transactions fast, safe, and reliable.
      </p>
    </div>
  </div>
);

const styles = {
  container: { textAlign: "center", marginTop: "100px", maxWidth: "700px", margin: "100px auto" },
};

export default AboutUs;

