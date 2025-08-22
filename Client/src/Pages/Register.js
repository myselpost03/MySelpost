import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import "../Styles/Register.css";
import bcrypt from "bcryptjs";
import imageCompression from "browser-image-compression";
import { supabase, supabaseStorage } from "../Utils/supabaseClient";
import { trackEvent } from "../Utils/analytics";
import confetti from "canvas-confetti"; // ✅ Import confettiimport { Toaster } from 'react-hot-toast';
import toast, { Toaster } from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; // ✅ Correct import

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePic: null,
    inviteCode: "",
  });
  const [inviteError, setInviteError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [compressing, setCompressing] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const [originalImage, setOriginalImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);

  const isMobileDevice = () =>
    /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const [step, setStep] = useState(1);
  const [emailValid, setEmailValid] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [country, setCountry] = useState("Hidden");

  const [nameTaken, setNameTaken] = useState(false);
  const navigate = useNavigate();
  const isEmailValid = (email) => {
    const trimmedEmail = email.trim().toLowerCase();

    // ✅ Strict email format check
    const basicPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!basicPattern.test(trimmedEmail)) return false;

    const allowedExactDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
      "icloud.com",
      "aol.com",
      "protonmail.com",
      "zoho.com",
      "mail.com",
      "gmx.com",
    ];

    const allowedMultiPartDomains = [
      "gmail.co.uk",
      "gmail.com.au",
      "outlook.co.uk",
      "yahoo.co.in",
      // Add more if needed
    ];

    const domain = trimmedEmail.split("@")[1];

    // Exact match check
    if (allowedExactDomains.includes(domain)) {
      return true;
    }

    // Multi-part domain match
    if (allowedMultiPartDomains.includes(domain)) {
      return true;
    }

    return false;
  };

  const [emailTaken, setEmailTaken] = useState(false);

  const checkEmailExists = async (email) => {
    if (!email) return false;
    const { data } = await supabase
      .from("users")
      .select("email")
      .eq("email", email);
    return data && data.length > 0;
  };

  // debounce email check
  useEffect(() => {
    if (!formData.email || !emailValid) return;
    const timeout = setTimeout(async () => {
      const exists = await checkEmailExists(formData.email);
      setEmailTaken(exists);
    }, 500);
    return () => clearTimeout(timeout);
  }, [formData.email, emailValid]);

  useEffect(() => {
    if (!formData.password) {
      setPasswordError("");
      return;
    }

    if (formData.password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
    } else {
      setPasswordError("");
    }
  }, [formData.password]);

  useEffect(() => {
    if (!formData.inviteCode.trim()) {
      setInviteError(""); // clear if empty
      return;
    }

    const timeout = setTimeout(async () => {
      const { data: inviteData, error } = await supabase
        .from("invites")
        .select("sender_id")
        .eq("code", formData.inviteCode.trim())
        .single();

      if (error || !inviteData) {
        setInviteError("❌ Invalid invite code.");
      } else {
        setInviteError(""); // valid code
      }
    }, 500); // debounce 0.5s

    return () => clearTimeout(timeout);
  }, [formData.inviteCode]);

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Google User Info:", decoded);

      // Optional: Check if user exists in supabase
      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("email", decoded.email)
        .single();

      let userId;
      if (existingUser) {
        userId = existingUser.id;
      } else {
        // Insert new user
        const { data: insertedUser, error: insertError } = await supabase
          .from("users")
          .insert([
            {
              name: decoded.name,
              email: decoded.email,
              profile_pic: decoded.picture || null,
              country: country,

              google_login: true,
            },
          ])
          .select()
          .single();

        if (insertError) throw insertError;
        userId = insertedUser.id;
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: userId,
          name: decoded.name,
          email: decoded.email,
          coins: existingUser?.reward_coins ?? 0,

          google_login: true,
        })
      );

      toast.success("Logged in with Google!");
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

      setTimeout(() => {
        if (isMobileDevice()) {
          navigate("/chat-list", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
        setLoading(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("Google login failed");
      setLoading(false);
    }
  };

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

  const compressAndResize = async (file, targetKB = 10) => {
    let quality = 0.9;
    let maxWidthOrHeight = 1000;
    let compressedFile = file;

    for (let i = 0; i < 10; i++) {
      const options = {
        maxSizeMB: targetKB / 1024,
        maxWidthOrHeight,
        initialQuality: quality,
        useWebWorker: true,
      };

      compressedFile = await imageCompression(file, options);
      const sizeKB = compressedFile.size / 1024;

      if (sizeKB <= targetKB) break;

      quality -= 0.1;
      maxWidthOrHeight = Math.floor(maxWidthOrHeight * 0.8);
      if (quality <= 0.1) quality = 0.1;
      file = compressedFile;
    }

    return compressedFile;
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const originalKB = (file.size / 1024).toFixed(2);
    setOriginalSize(originalKB);
    setOriginalImage(URL.createObjectURL(file));
    let intervalId;

    try {
      setCompressing(true); // 🚀 start compressing
      setElapsedTime(0);

      // ⏱ Start timer
      const start = Date.now();
      intervalId = setInterval(() => {
        const seconds = Math.floor((Date.now() - start) / 1000);
        setElapsedTime(seconds);
      }, 1000);
      const compressedFile = await compressAndResize(file, 10);

      const compressedKB = (compressedFile.size / 1024).toFixed(2);
      console.log("Compressed size KB:", compressedFile.size / 1024);

      setCompressedSize(compressedKB);
      setCompressedImage(URL.createObjectURL(compressedFile));

      setFormData((prev) => ({
        ...prev,
        profilePic: compressedFile,
      }));
    } catch (error) {
      console.error("Compression error:", error);
    } finally {
      setCompressing(false); // ✅ done compressing
      clearInterval(intervalId);
    }
  };

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "email") {
      setEmailValid(isEmailValid(value));
    }

    if (name === "profilePic" && files && files[0]) {
      await handleImageUpload(e);
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
      !nameTaken &&
      !passwordError
    ) {
      const delay = setTimeout(() => {
        setStep(2);
      }, 500);
      return () => clearTimeout(delay);
    }
  }, [
    formData.name,
    formData.email,
    emailValid,
    nameTaken,
    passwordError,
    step,
  ]);

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
      // Required fields check
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

      // Password length check
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters long.");
        setLoading(false);
        return;
      }

      const { data: existingEmail } = await supabase
        .from("users")
        .select("email")
        .eq("email", formData.email)
        .single();

      if (existingEmail) {
        setError("Email is already registered.");
        setLoading(false);
        return;
      }

      // File type validation
      const validTypes = ["image/jpeg", "image/png", "image/webp"];

      if (!formData.profilePic.type.startsWith("image/")) {
        setError("Invalid image file.");
        setLoading(false);
        return;
      }

      if (!validTypes.includes(formData.profilePic.type)) {
        setError("Invalid image format. Only JPEG, PNG, JPG allowed.");
        setLoading(false);
        return;
      }

      let inviterId = null;
      if (formData.inviteCode) {
        const { data: inviteData, error: inviteError } = await supabase
          .from("invites")
          .select("sender_id")
          .eq("code", formData.inviteCode.trim())
          .single();

        if (inviteError || !inviteData) {
          setInviteError("❌ Invalid invite code.");
          setLoading(false);
          return;
        }
        inviterId = inviteData.sender_id;
        setInviteError("");
      }

      const hashedPassword = await bcrypt.hash(formData.password, 10);

      // Upload profile pic to storage DB
      let profilePicUrl = null;
      if (formData.profilePic) {
        const fileExt = formData.profilePic.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabaseStorage.storage
          .from("profile-pics")
          .upload(filePath, formData.profilePic);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabaseStorage.storage
          .from("profile-pics")
          .getPublicUrl(filePath);

        profilePicUrl = publicUrlData.publicUrl;
      }

      // Insert user into main DB
      const { error: insertError } = await supabase.from("users").insert([
        {
          name: formData.name,
          email: formData.email,
          password: hashedPassword,
          profile_pic: profilePicUrl,
          country: country,
          inviter_id: inviterId, // ✅ store inviter
          invite_code_used: formData.inviteCode || null,
          // device_id: deviceId,
        },
      ]);

      if (insertError) throw insertError;

      if (inviterId) {
        await supabase.rpc("increment_reward_coins", {
          user_id_input: inviterId,
          increment_by: 50,
        });
      }
      // Track registration event
      trackEvent({
        action: "button_click",
        category: "User Interaction",
        label: "Register Button",
      });

      // Simulate login after registration
      const { data: userData, error: loginError } = await supabase
        .from("users")
        .select("*")
        .eq("email", formData.email)
        .single();

      if (loginError || !userData) {
        setError("Failed to log in after registration.");
        return;
      }

      const passwordMatch = await bcrypt.compare(
        formData.password,
        userData.password
      );
      if (!passwordMatch) {
        setError("Password mismatch.");
        return;
      }

      // Save user locally
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
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

      setTimeout(() => {
        setShowAlert(false);
        if (isMobileDevice()) {
          navigate("/chat-list", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
        setLoading(false);
      }, 2000);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLoginError = () => {
    toast.error("Google login failed");
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
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={handleGoogleLoginError}
                ux_mode="popup"
              />
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
              {emailTaken && (
                <p className="error-msg">Email is already registered.</p>
              )}
              <p className="step-indicator">Step 1 of 2</p>
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
                className={passwordError ? "invalid" : ""}
              />
              {passwordError && <p className="error-msg">{passwordError}</p>}

              <input
                type="text"
                name="inviteCode"
                placeholder="Invite Code (optional)"
                value={formData.inviteCode}
                onChange={(e) =>
                  setFormData({ ...formData, inviteCode: e.target.value })
                }
                className={`input ${inviteError ? "input-error" : ""}`}
              />
              {inviteError && <p className="error-text">{inviteError}</p>}

              <div className="profile-pic-selector">
                <label className="profile-pic-card">
                  <span className="profile-pic-text">
                    {formData.profilePic
                      ? "File Selected"
                      : "Click here to choose a profile picture"}
                  </span>
                  <input
                    type="file"
                    name="profilePic"
                    accept="image/*"
                    onChange={handleChange}
                    className="profile-pic-input"
                    required
                  />
                </label>
              </div>

              {error && <p className="error-msg">{error}</p>}

              <button
                type="submit"
                disabled={!isFormValid || loading || compressing}
                className="register-btn"
              >
                {compressing
                  ? `Compressing... (${elapsedTime}s)`
                  : loading
                  ? "Registering..."
                  : "Register"}
              </button>

              <p className="link-to-login">
                Already have an account? <Link to="/login">Login</Link>
              </p>

              <p className="step-indicator">Step 2 of 2</p>
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
