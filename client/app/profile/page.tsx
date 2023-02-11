"use client";

import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { getCookie } from "../../src/util/cookies";
import { formattedDate } from "../../src/util/general";
import "./page.scss";

const getUserScripts = async (userId: string) => {
  const res = await fetch(`http://localhost:5000/scripts/get/user/${userId}`, { next: { revalidate: 100 } });
  const user = await res.json();
  return user;
};

function Page() {
  const [userScripts, setUserScripts] = useState([]);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({} as any);

  useEffect(() => {
    const isLoggedIn: any = JSON.parse(getCookie("loginInfo") as any);
    if (isLoggedIn && isLoggedIn.userData && isLoggedIn.userData._id) {
      setIsLoading(true);
      getUserScripts(isLoggedIn.userData._id).then((scripts) => {
        setUserData(isLoggedIn.userData);
        setUserScripts(scripts);
        setIsLoading(false);
      });
    }
  }, []);

  const updateScript = async (scriptId: string, i: number) => {
    let script: any = document ? document.querySelector(".script-json-" + i) : null;
    let value: string = script && script.value ? script.value : "";
    try {
      console.log(JSON.parse(value));
    } catch (e) {
      setStatus("Invalid JSON");
    }
    const res = await fetch(`http://localhost:5000/scripts/update/${scriptId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        script: value,
      }),
    });
    const result = await res.json();
    setStatus("Updated JSON");
    console.log(result);
    return true;
  };

  const deleteScript = async (scriptId: string) => {
    console.log("script ID", scriptId);
    return true;
  };

  const { Control, Label, Group } = Form;
  return (
    <Container className="profile">
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <Row>
          <h1>{userData.username}</h1>
          <p className="status">{status}</p>
          {userScripts.map((script: any, i: number) => {
            return (
              <Col key={script._id} xs={6}>
                <h2>{script.name}</h2>
                <p>Created Date: {formattedDate(script.createdAt)}</p>
                <p>Updated Date: {formattedDate(script.updatedAt)}</p>
                <Group>
                  <Label>Modify JSON Script</Label>
                  <Control className={"script-json-" + i} as="textarea" rows={10} placeholder="Chart progress" name={"script-json-" + i} defaultValue={script.script} />
                  <Button onClick={() => updateScript(script._id, i)}>Update</Button>
                  <Button onClick={() => deleteScript(script._id)}>Delete</Button>
                </Group>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
}

export default Page;
