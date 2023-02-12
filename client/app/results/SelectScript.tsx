import { Form, Button, Col, Dropdown, Row, Container } from "react-bootstrap";
import { useState, useEffect } from "react";
const { Group } = Form;
const { Menu, Toggle, Item } = Dropdown;

const loadScripts = async (id: string) => {
  const res = await fetch(`http://localhost:5000/scripts/get/user/${id}`, { next: { revalidate: 300 } });
  const script = await res.json();
  return script;
};

const loadScript = async (script: any) => {
  const scriptArea = document.querySelector(".script-textarea");
  scriptArea && (scriptArea.innerHTML = script.script);
};

const SelectScript = (props) => {
  const [selectedScript, setSelectedScript] = useState(null as any);
  const [scripts, setScripts] = useState([] as any[]);
  let { userInfo, setStatus } = props;
  userInfo = JSON.parse(userInfo);

  useEffect(() => {
    const fetchScripts = async () => {
      try {
        if (userInfo.userData && userInfo.userData._id) {
          const fetchedScripts = await loadScripts(userInfo.userData._id);
          setScripts(fetchedScripts);
        }
      } catch (e) {}
    };
    fetchScripts();
  }, []);

  const createScript = async (userId: any) => {
    let script: any = document ? document.querySelector(".script-textarea") : null;
    let value: string = script && script.value ? script.value : "";
    let scriptName: any = document ? document.querySelector(".new-script-name") : null;
    let name: string = scriptName && scriptName.value ? scriptName.value : "";
    try {
      console.log(value);
      console.log(JSON.parse(value));
    } catch (e) {
      setStatus("Invalid JSON");
      return;
    }
    const res = await fetch(`http://localhost:5000/scripts/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        script: value,
        name,
        userId,
      }),
    });
    const result = await res.json();
    setStatus("Created the new script: " + result.name);
    return result;
  };

  return (
    <Container className="load-script-section">
      <Row>
        <Col className="script-selection" xs={12}>
          <Group key="loadScript" className="load-script">
            <Dropdown title="Scripts" id="basic-nav-dropdown">
              <Toggle variant="success" id="dropdown-basic">
                {selectedScript ? selectedScript.name : "Select Script"}
              </Toggle>
              <Menu>
                {scripts &&
                  scripts.map((script: any) => {
                    return (
                      <Item key={script.id} value={script.id} onClick={() => setSelectedScript(script)}>
                        {script.name}
                      </Item>
                    );
                  })}
              </Menu>
            </Dropdown>
          </Group>
        </Col>
      </Row>
      {selectedScript ? (
        <Row className="script-selection-options form-group">
          <Col xs={3}>
            <Button onClick={() => loadScript(selectedScript)}>Load Script</Button>
          </Col>
          <Col xs={9}>
            <Form.Control type="text" className="new-script-name" />
            <Button onClick={() => createScript(userInfo.userData._id)}>Create Script</Button>
          </Col>
        </Row>
      ) : null}
    </Container>
  );
};

export default SelectScript;
