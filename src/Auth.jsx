import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  const handleSendOtp = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (error) {
      alert(error.error_description || error.message);
    } else {
      setStep(2);
      alert("Check your email for the OTP code!");
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });
    setLoading(false);
    if (error) {
      alert(error.error_description || error.message);
    } else {
      alert("OTP verified! You are signed in.");
    }
  };

  return (
    <div className="row flex flex-center auth-container">
      <div className="col-6 form-widget">
        <h1 className="header">Pebli</h1>
        <p className="description">
          Sign in with your email and a one-time code
        </p>
        {step === 1 ? (
          <form className="form-widget" onSubmit={handleSendOtp}>
            <div className="sign-in-input">
              <input
                className="inputField"
                type="email"
                placeholder="Your email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="sign-in-button">
              <button className="button block" disabled={loading}>
                {loading ? <span>Loading</span> : <span>Send OTP</span>}
              </button>
            </div>
          </form>
        ) : (
          <form className="form-widget" onSubmit={handleVerifyOtp}>
            <div className="sign-in-input">
              <input
                className="inputField"
                type="text"
                placeholder="Enter OTP code"
                value={otp}
                required
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <div className="sign-in-button">
              <button className="button block" disabled={loading}>
                {loading ? <span>Verifying...</span> : <span>Verify OTP</span>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
