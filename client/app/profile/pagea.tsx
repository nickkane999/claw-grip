"use client";

import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import { getCookie } from "../../src/util/cookies";

const getUserScripts = async (userId: string) => {
  const res = await fetch(`http://localhost:5000/scripts/get/user/${userId}`, { next: { revalidate: 1 } });
  const user = await res.json();
  return user;
};

function Page() {
  const [userScripts, setUserScripts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({} as any);

  useEffect(() => {
    const isLoggedIn: any = JSON.parse(getCookie("loginInfo") as any);
    if (isLoggedIn && isLoggedIn.userData && isLoggedIn.userData._id) {
      setIsLoading(true);
      getUserScripts(isLoggedIn.userData._id).then((scripts) => {
        console.log("results");
        console.log(scripts);
        setUserData(isLoggedIn.userData);
        setUserScripts(scripts);
        setIsLoading(false);
      });
    }
  }, []);

  return (
    <Container className="profile">
      {!userScripts ? (
        <h1>Loading...</h1>
      ) : (
        <Row>
          {/* ts-ignore */}
          <h1>{userData.username}</h1>
          {userScripts.map((script: any) => {
            return (
              <Col key={script._id} xs={6}>
                <h2>{script.name}</h2>
                <p>{script.script}</p>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
}

export default Page;
