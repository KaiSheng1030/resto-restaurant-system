import React, { useState, useEffect } from "react";
import "./CustomerLogin.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function CustomerLogin({ setPage, lang, changeLang, setUserPhone, setUserRole }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("customer");

  /* 🌙 Theme System */
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const t = {
    en: {
      welcome: "Welcome back",
      subtitle: "Please enter your details to sign in",
      titleCustomer: "Customer Login",
      titleOwner: "Admin / Owner Login",
      phone: "Phone Number",
      password: "Password",
      continue: "Continue",
      login: "Log in",
      switchOwner: "Owner / Admin?",
      switchCustomer: "Customer?",
      placeholderPassword: "Enter password",
    },
    zh: {
      welcome: "欢迎回来",
      subtitle: "请输入资料进行登入",
      titleCustomer: "顾客登入",
      titleOwner: "管理员 / 老板登入",
      phone: "手机号码",
      password: "密码",
      continue: "继续",
      login: "登入",
      switchOwner: "老板 / 管理员？",
      switchCustomer: "顾客？",
      placeholderPassword: "输入密码",
    },
  };

  /* ⭐ CUSTOMER LOGIN */
  const handleCustomerLogin = () => {
    if (!phone.trim()) return alert("Please enter phone number");

    setUserPhone(phone);
    setUserRole("customer");
    localStorage.setItem("role", "customer");

    setPage("customer"); // customer goes to reservation
  };

  /* ⭐ ADMIN & OWNER LOGIN */
  const handleOwnerLogin = () => {
    if (!password.trim()) return alert("Enter password");

    if (password === "admin123") {
      // ADMIN
      setUserRole("admin");
      localStorage.setItem("role", "admin");
      setPage("admin");        // ⭐ Admin should go to Admin Panel
    }
    else if (password === "owner123") {
      // OWNER
      setUserRole("owner");
      localStorage.setItem("role", "owner");
      setPage("owner");        // ⭐ Owner goes to Owner Panel
    }
    else {
      alert("Wrong password");
    }
  };

  return (
    <div className="login-wrapper">
      
      {/* 🌍 Language Button */}
      <button className="lang-btn" onClick={() => changeLang(lang === "en" ? "zh" : "en")}>
        {lang === "en" ? "中文" : "EN"}
      </button>

      {/* 🌙 Theme Toggle */}
      <button className="theme-btn" onClick={toggleTheme}>
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      <div className="login-card">

        {/* Logo */}
        <div className="login-logo">
          <svg width="52" height="52" viewBox="0 0 24 24" fill="#7d6bff">
            <path d="M7 2C6.448 2 6 2.448 6 3V10C6 11.657 7.343 13 9 13V22H11V13C12.657 13 14 11.657 14 10V3C14 2.448 13.552 2 13 2H12V8H10V2H9V8H7V2H7Z"/>
            <path d="M18 2C16.343 2 15 3.343 15 5V10C15 11.657 16.343 13 18 13C19.657 13 21 11.657 21 10V5C21 3.343 19.657 2 18 2Z"/>
          </svg>
          <h1>Resto</h1>
        </div>

        <h2 className="welcome-title">{t[lang].welcome}</h2>
        <p className="welcome-sub">{t[lang].subtitle}</p>

        <h3 className="mode-title">
          {mode === "customer" ? t[lang].titleCustomer : t[lang].titleOwner}
        </h3>

        {/* CUSTOMER LOGIN */}
        {mode === "customer" && (
          <>
            <label>{t[lang].phone}</label>
            <PhoneInput
              country={"my"}
              value={phone}
              onChange={(v) => setPhone("+" + v)}
              enableSearch
              countryCodeEditable={false}
              inputStyle={{
                width: "100%",
                height: "45px",
                borderRadius: "10px",
              }}
            />

            <button className="login-btn" onClick={handleCustomerLogin}>
              {t[lang].continue}
            </button>
          </>
        )}

        {/* ADMIN / OWNER LOGIN */}
        {mode === "owner" && (
          <>
            <label>{t[lang].password}</label>
            <input
              type="password"
              value={password}
              placeholder={t[lang].placeholderPassword}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="login-btn" onClick={handleOwnerLogin}>
              {t[lang].login}
            </button>
          </>
        )}

        <div className="switch-mode">
          <button onClick={() => setMode(mode === "customer" ? "owner" : "customer")}>
            {mode === "customer" ? t[lang].switchOwner : t[lang].switchCustomer}
          </button>
        </div>

      </div>
    </div>
  );
}
