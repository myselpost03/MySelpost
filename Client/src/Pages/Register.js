import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import "../Styles/Register.css";
import bcrypt from "bcryptjs";
import imageCompression from "browser-image-compression";
import { supabase } from "../Utils/supabaseClient";
import { trackEvent } from "../Utils/analytics";
import confetti from "canvas-confetti"; // ✅ Import confettiimport { Toaster } from 'react-hot-toast';
import toast, { Toaster } from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePic: null,
  });

  const [step, setStep] = useState(1);
  const [emailValid, setEmailValid] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [country, setCountry] = useState("Hidden");

  const [nameTaken, setNameTaken] = useState(false);
  const navigate = useNavigate();

  const isEmailValid = (email) =>
    /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email.trim().toLowerCase());

  /*const [deviceId, setDeviceId] = useState(null);
  const [deviceBlocked, setDeviceBlocked] = useState(false);

  useEffect(() => {
    let id = localStorage.getItem("device_id");
    if (!id) {
      id = crypto.randomUUID(); // or use a hash function if preferred
      localStorage.setItem("device_id", id);
    }
    setDeviceId(id);

    // Check if the device already has an account
    const checkDeviceId = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("device_id")
        .eq("device_id", id);

      if (data && data.length > 0) {
        setDeviceBlocked(true);
      }
    };

    checkDeviceId();
  }, []);
*/
  useEffect(() => {
    const validateStep1 = async () => {
      if (!formData.name || !formData.email) return;

      const nameExists = await checkNameExists(formData.name);
      setNameTaken(nameExists); // set inside the check

      if (emailValid && !nameExists) {
        setTimeout(() => {
          setStep(2);
        }, 500);
      }
    };

    if (step === 1) {
      validateStep1();
    }
  }, [formData.name, formData.email, emailValid, step]);

  const checkNameExists = async (name) => {
    if (!name) return false;
    const { data } = await supabase
      .from("users")
      .select("name")
      .eq("name", name);
    return data && data.length > 0;
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      checkNameExists(formData.name);
    }, 500);
    return () => clearTimeout(timeout);
  }, [formData.name]);

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "email") {
      setEmailValid(isEmailValid(value));
    }

    if (name === "profilePic" && files && files[0]) {
      const originalFile = files[0];
      console.log(
        `🖼️ Original file size: ${(originalFile.size / 1024 / 1024).toFixed(
          2
        )} MB`
      );

      try {
        const options = {
          maxSizeMB: 0.5, // Limit to 0.5 MB
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(originalFile, options);

        console.log(
          `📉 Compressed file size: ${(
            compressedFile.size /
            1024 /
            1024
          ).toFixed(2)} MB`
        );

        setFormData((prev) => ({
          ...prev,
          profilePic: compressedFile,
        }));
      } catch (error) {
        console.error("❌ Image compression error:", error);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    fetch("https://ipwho.is/?fields=country_code")
      .then((res) => res.json())
      .then((response) => {
        setCountry(response.country_code || "Hidden");
      })
      .catch(() => setCountry("Hidden"));
  }, []);

  useEffect(() => {
    if (
      step === 1 &&
      formData.name &&
      formData.email &&
      emailValid &&
      !nameTaken
    ) {
      const delay = setTimeout(() => {
        setStep(2);
      }, 500);
      return () => clearTimeout(delay);
    }
  }, [formData.name, formData.email, emailValid, nameTaken, step]);

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.password &&
    formData.profilePic &&
    emailValid &&
    !nameTaken;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.profilePic
      ) {
        setError("All fields are required.");
        setLoading(false);
        return;
      }

      {
        /*if (deviceBlocked) {
        setError("Account already exists on this device.");
        setLoading(false);
        return;
      }*/
      }

      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters long.");
        setLoading(false);
        return;
      }

      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(formData.profilePic.type)) {
        setError("Only JPG, PNG, or WEBP images are allowed.");
        setLoading(false);
        return;
      }
      const hashedPassword = await bcrypt.hash(formData.password, 10);

      let profilePicUrl = null;
      if (formData.profilePic) {
        const fileExt = formData.profilePic.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("profile-pics")
          .upload(filePath, formData.profilePic);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("profile-pics")
          .getPublicUrl(filePath);

        profilePicUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabase.from("users").insert([
        {
          name: formData.name,
          email: formData.email,
          password: hashedPassword,
          profile_pic: profilePicUrl,
          country: country,
          //  device_id: deviceId,
        },
      ]);

      if (error) throw error;

      trackEvent({
        action: "button_click",
        category: "User Interaction",
        label: "Register Button",
      });
      // Simulate login: fetch the user from your DB
      const { data: userData, error: loginError } = await supabase
        .from("users")
        .select("*")
        .eq("email", formData.email)
        .single();

      if (loginError || !userData) {
        setError("Failed to log in after registration.");
        return;
      }

      // Check password manually (bcrypt compare)
      const passwordMatch = await bcrypt.compare(
        formData.password,
        userData.password
      );
      if (!passwordMatch) {
        setError("Password mismatch.");
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          coins: userData.reward_coins ?? 0,
          rewardTime: userData.last_coin_award_time ?? null,
        })
      );
      setShowAlert(true);
      toast.success("Registered Successfully!");
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        setShowAlert(false);
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="register-container">
        <form
          className="register-form"
          onSubmit={async (e) => {
            e.preventDefault();
            await handleSubmit(e);
          }}
        >
          <h2 className="acct-text">Create an Account</h2>

          {step === 1 && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className={nameTaken ? "invalid" : ""}
              />
              {nameTaken && (
                <p className="error-msg">
                  Name already taken. Please choose another.
                </p>
              )}

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className={!emailValid ? "invalid" : ""}
              />
              {!emailValid && (
                <p className="error-msg">Please enter a valid email address.</p>
              )}
              <p className="step-indicator">Step 1 of 2 ✅</p>
            </>
          )}

          {step === 2 && (
            <>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <label style={{ marginTop: "10px" }}>Profile Pic</label>
              <input
                type="file"
                name="profilePic"
                accept="image/*"
                onChange={handleChange}
                required
              />

              {error && <p className="error-msg">{error}</p>}

              <button type="submit" disabled={!isFormValid || loading}>
                {loading ? "Registering..." : "Register"}
              </button>

              <p className="link-to-login">
                Already have an account? <Link to="/login">Login</Link>
              </p>

              <p className="step-indicator">Step 2 of 2 📸</p>
            </>
          )}
        </form>
        {/*deviceBlocked && (
          <p className="error-msg">
            An account has already been created on this device.
          </p>
        )*/}
      </div>

      <Toaster />
    </div>
  );
};

export default Register;
