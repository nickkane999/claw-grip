"use client";

import React, { useState } from "react";
import Link from "next/link";
import { getCookie, clearLogin } from "../util/cookies";
import "./nav.scss";

function nav() {
  const [isLoggedIn, setIsLoggedIn] = useState(getCookie("loginInfo") ? true : false);

  const logOff = () => {
    clearLogin();
    setIsLoggedIn(false);
    if (window.location.href.includes("/profile")) {
      document.body.style.cursor = "wait";
      window.location.href = "/";
    }
  };
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/results">Results</Link>
        </li>
        <li>
          <Link href="/scripts">Scripts</Link>
        </li>
        {isLoggedIn ? (
          <>
            <li>
              <Link href="#" onClick={logOff}>
                Logout
              </Link>
            </li>
            <li>
              <Link href="/profile">Profile</Link>
            </li>
          </>
        ) : (
          <li>
            <Link href="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default nav;
