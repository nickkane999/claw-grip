"use client";

type result = {
  result: string;
};

const testScript = async () => {
  const res = await fetch(`http://localhost:5000/puppeteer/basic`);
  const script = await res.json();
  const scriptText = JSON.stringify(script);
  const testResults = document.querySelector(".test-results");
  testResults && script && script ? (testResults.innerHTML = scriptText) : testResults ? (testResults.innerHTML = "No results") : null;
};

function Page() {
  return (
    <div className="container">
      <h1>Results</h1>
      <button onClick={testScript}>Test</button>
      <h2>Test results:</h2>
      <p className="test-results"></p>
    </div>
  );
}

export default Page;
