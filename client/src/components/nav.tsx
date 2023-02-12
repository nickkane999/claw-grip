"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getCookie, clearLogin } from "../util/cookies";
import "./nav.scss";

function nav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const isLoggedIn = getCookie("loginInfo");
    isLoggedIn ? setIsLoggedIn(true) : setIsLoggedIn(false);
  }, [isLoggedIn]);

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
        <li>
          <Link href="/users">Users</Link>
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
