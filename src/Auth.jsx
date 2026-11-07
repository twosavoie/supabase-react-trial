import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendOtp = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (error) {
      setError(error.error_description || error.message);
    } else {
      setStep(2);
      setMessage("Check your email for the OTP code!");
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });
    setLoading(false);
    if (error) {
      setError(error.error_description || error.message);
    } else {
      setMessage("OTP verified! You are signed in.");
    }
  };

  return (
    <div className="row flex flex-center auth-container">
      <div className="col-6 form-widget">
        <h1 className="header">Pebli</h1>
        <p className="description">
          Enter your email to receive a one-time code (OTP).
        </p>
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        {step === 1 ? (
          <form className="form-widget" onSubmit={handleSendOtp}>
            <div className="sign-in-input">
              <label htmlFor="email" className="auth-email-input-label">
                Enter your email:
                <input
                  className="inputField"
                  id="email"
                  type="email"
                  placeholder="myemail@example.com"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </label>
            </div>
            <div className="sign-in-button">
              <button className="button block auth-button" disabled={loading}>
                {loading ? <span>Loading</span> : <span>Send OTP</span>}
              </button>
            </div>
          </form>
        ) : (
          <form className="form-widget" onSubmit={handleVerifyOtp}>
            <div className="sign-in-input">
              <label htmlFor="otp" className="auth-otp-input-label">
                Enter OTP code:
                <input
                  className="inputField"
                  id="otp"
                  type="text"
                  placeholder="Enter OTP code"
                  value={otp}
                  required
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={loading}
                />
              </label>
            </div>
            <div className="sign-in-button">
              <button className="button block otp-button" disabled={loading}>
                {loading ? <span>Verifying...</span> : <span>Verify OTP</span>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
