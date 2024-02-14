import React, { useState, useEffect, useContext } from "react";
import { FaTimes } from "react-icons/fa";
import { TbListDetails } from "react-icons/tb";
import API_ENDPOINTS from "../components/apiConfig";
import { timezones } from "../lib/timezones";
import AuthContext from "../contexts/AuthContext";
import ScreenContext from "../contexts/ScreenContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedinIn } from "react-icons/fa6";

export default function SignUp(props) {
  const [selectedOption, setSelectedOption] = React.useState("");

  const { handleRegister, handleSocialLogin } = useContext(AuthContext);
  const { navigateToPage } = useContext(ScreenContext);
  const [userTimezone, setUserTimezone] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(detectedTimezone);
  }, []);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div>
      <div
        className="container"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <div className="card my-1" style={{ border: "none" }}>
              <div className="mb-5"></div>
              <div className="card-body cardbody-color p-lg-5">
                <form
                  onSubmit={handleRegister}
                  style={{
                    paddingTop: "80px",
                    fontFamily: "'Lato', sans-serif",
                  }}
                >
                  <h2 className="text-dark " style={{ fontWeight: "600" }}>
                    Welcome to Skoop!
                  </h2>
                  <p
                    className="text-center form-text "
                    style={{ color: "rgba(44, 45, 46, 0.5)", fontSize: "14px" }}
                  >
                    It’s time to get more clients and connect again with old
                    connections
                  </p>
                  <div className="mb-2"></div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="first-name"
                      placeholder="Full Name"
                      name="firstName"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Email Address"
                      name="email"
                      required
                    />
                  </div>
                  <div className="mb-3 position-relative">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      className="form-control"
                      id="password"
                      placeholder="Password"
                      name="password"
                      required
                    />
                    <button
                      className="btn btn-link position-absolute end-0 top-50 translate-middle-y password-icon"
                      type="button"
                      onClick={togglePasswordVisibility}
                    >
                      {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {/* <div className="mb-3 position-relative">
                                    <input
                                        type={passwordVisible ? "text" : "password"}
                                        className="form-control"
                                        id="confirm-password"
                                        placeholder="Confirm Password"
                                        name="confirmPassword"
                                        required
                                    />
                                    <button
                                        className="btn btn-link position-absolute end-0 top-50 translate-middle-y password-icon"
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div> */}

                  {/* <div className="mb-3">
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="confirm-password"
                                        placeholder="Confirm Password"
                                        name="confirmPassword"
                                        required
                                    />
                                </div> */}

                  <div className="mb-3" style={{ display: "none" }}>
                    <select
                      className="form-select"
                      id="timezone"
                      name="timezone"
                    >
                      <option selected>Select Timezone</option>
                      {timezones.map((option, index) => (
                        <option
                          key={index}
                          value={option}
                          selected={option === userTimezone}
                        >
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg mt-3 mb-2 w-100"
                      style={{
                        backgroundColor: "#2D68C4",
                        fontSize: "16px",
                        fontWeight: "600",
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </form>
                <div id="emailHelp" className="form-text text-start mb-2">
                  By clicking submit you are agreeing to{" "}
                  <span class="footer-font">privacy policies</span> &{" "}
                  <span class="footer-font">Terms of use</span>
                </div>
                <div className="text-center form-text mt-5 mb-2">
                  <h6>or Sign up with</h6>
                </div>
                <div
                  className="text-center"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg mt-2 mb-3 w-100"
                    style={{
                      backgroundColor: "#007BB5",
                      fontSize: "14px",
                      fontWeight: "300",
                    }}
                    onClick={() => handleSocialLogin(1)}
                  >
                    <FaLinkedinIn className="button-icon" /> Continue with
                    LinkedIn
                  </button>

                  <button
                    type="submit"
                    className="btn btn-outline-dark btn-lg mb-3 w-100 button-size"
                    style={{ fontSize: "14px", fontWeight: "300" }}
                    onClick={() => handleSocialLogin(2)}
                  >
                    <FcGoogle className="button-icon" /> Continue with Google
                  </button>
                </div>

                <div className="form-text text-center mb-2 text-dark">
                  Already have an account?{" "}
                  <a
                    href="#"
                    onClick={() => navigateToPage("SignIn")}
                    className="fw-bold footer-font"
                  >
                    Sign in
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
