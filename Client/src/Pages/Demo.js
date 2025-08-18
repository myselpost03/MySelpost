import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import {jwtDecode} from "jwt-decode"; // to decode JWT token

export default function Demo() {
  const handleLoginSuccess = (credentialResponse) => {
    // credentialResponse contains JWT token
    const decoded = jwtDecode(credentialResponse.credential);
    console.log("User Info:", decoded);
    // You can store user data in localStorage or Context API
    localStorage.setItem("user", JSON.stringify(decoded));
  };

  const handleLoginError = () => {
    console.log("Login Failed");
  };

  return (
    <div>
      <h2>Login with Google</h2>
<GoogleLogin
  onSuccess={handleLoginSuccess}
  onError={handleLoginError}
  ux_mode="redirect"
/>

    </div>
  );
}
