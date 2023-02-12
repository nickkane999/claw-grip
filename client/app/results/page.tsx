"use client";
import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import SelectScript from "./SelectScript";
import { getCookie } from "../../src/util/cookies";
import { formattedDate } from "../../src/util/general";
import "./page.scss";

function Page() {
  const [userScripts, setUserScripts] = useState([]);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({} as any);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const isLoggedIn = getCookie("loginInfo");
    isLoggedIn ? setIsLoggedIn(isLoggedIn) : setIsLoggedIn(false);
  }, [isLoggedIn]);

  const testScript = async () => {
    setIsLoading(true);
    let script: any = document ? document.querySelector(".script-textarea") : null;
    let value: string = script && script.value ? script.value : "";
    try {
      console.log(JSON.parse(value));
    } catch (e) {
      setStatus("Invalid JSON");
      setIsLoading(false);
      return;
    }
    console.log("Testing it");
    const res = await fetch(`http://localhost:5000/puppeteer/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        script: value,
      }),
    });
    const result = await res.json();
    setStatus("Script finished processing");
    setIsLoading(false);
    console.log(result);

    const scriptText = JSON.stringify(result);
    const testResults = document.querySelector(".test-results");
    testResults && script && script ? (testResults.innerHTML = scriptText) : testResults ? (testResults.innerHTML = "No results") : null;
  };

  const { Control, Label, Group } = Form;
  return (
    <Container className="results">
      <h1>Results</h1>
      {isLoggedIn ? <SelectScript userInfo={isLoggedIn} setStatus={setStatus} /> : null}
      <p className="status">{status}</p>
      <Col>
        <Control as="textarea" rows={10} className="script-textarea" />
      </Col>

      <Button onClick={testScript}>Test</Button>
      <h2>Test results:</h2>
      {isLoading ? <p>Loading...</p> : null}
      <p className="test-results"></p>
    </Container>
  );
}

export default Page;
