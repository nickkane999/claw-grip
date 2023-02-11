"use client";
import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { getCookie } from "../../src/util/cookies";
import { formattedDate } from "../../src/util/general";

function Page() {
  const [userScripts, setUserScripts] = useState([]);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({} as any);

  const testScript = async () => {
    setIsLoading(true);
    let script: any = document ? document.querySelector(".my-script") : null;
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
      <p className="status">{status}</p>
      <Col>
        <Control as="textarea" rows={10} className="my-script" />
      </Col>

      <button onClick={testScript}>Test</button>
      <h2>Test results:</h2>
      {isLoading ? <p>Loading...</p> : null}
      <p className="test-results"></p>
    </Container>
  );
}

export default Page;
