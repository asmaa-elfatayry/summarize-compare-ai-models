// import React, { useState } from "react";
// import axios from "axios";

// function App() {
//   const [inputText, setInputText] = useState("");
//   const [summary, setSummary] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSummarize = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const response = await axios.post(
//         "https://localhost:7217/summarize",
//         {
//           text: inputText,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       console.log(response);
//       setSummary(response.data[0].summary_text);
//     } catch (err) {
//       console.error(err);
//       setError(
//         "Something went wrong while summarizing. Please check your API."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
//       <h1 style={{ color: "#4A90E2" }}>Text Summarizer</h1>
//       <textarea
//         rows="8"
//         cols="80"
//         value={inputText}
//         onChange={(e) => setInputText(e.target.value)}
//         placeholder="Enter text here to summarize..."
//         style={{
//           width: "100%",
//           padding: "10px",
//           fontSize: "1rem",
//           borderRadius: "5px",
//           border: "1px solid #ccc",
//           marginTop: "1rem",
//         }}
//       />
//       <br />
//       <button
//         onClick={handleSummarize}
//         disabled={loading}
//         style={{
//           marginTop: "1rem",
//           padding: "10px 20px",
//           backgroundColor: "#4A90E2",
//           color: "white",
//           border: "none",
//           borderRadius: "5px",
//           cursor: loading ? "not-allowed" : "pointer",
//           fontWeight: "bold",
//           fontSize: "1rem",
//         }}
//       >
//         {loading ? "Summarizing..." : "Summarize"}
//       </button>

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {summary && (
//         <div
//           style={{
//             marginTop: "2rem",
//             padding: "1rem",
//             backgroundColor: "#f0f4f8",
//             borderRadius: "8px",
//             boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//           }}
//         >
//           <h3 style={{ color: "#333" }}>Summary:</h3>
//           <p style={{ fontSize: "1.1rem", lineHeight: "1.5", color: "#555" }}>
//             {summary}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSummarize = async () => {
    setLoading(true);
    setError("");
    setResults(null);
    try {
      const response = await axios.post(
        "https://localhost:7217/compare-summaries",
        { text: inputText },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(response);
      setResults(response.data);
    } catch (err) {
      setError("Something went wrong. Please check your API.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#4A90E2" }}>Compare Summarizers</h1>
      <textarea
        rows="8"
        cols="80"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text here to summarize..."
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "1rem",
          borderRadius: "5px",
          border: "1px solid #ccc",
          marginTop: "1rem",
        }}
      />
      <br />
      <button
        onClick={handleSummarize}
        disabled={loading}
        style={{
          marginTop: "1rem",
          padding: "10px 20px",
          backgroundColor: "#4A90E2",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: "bold",
          fontSize: "1rem",
        }}
      >
        {loading ? "Summarizing..." : "Compare Summaries"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {results && (
        <div style={{ marginTop: "2rem" }}>
          {Object.entries(results).map(([model, summary]) => (
            <div
              key={model}
              style={{
                marginBottom: "1.5rem",
                padding: "1rem",
                backgroundColor: "#f0f4f8",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ color: "#333", textTransform: "capitalize" }}>
                {model.replace(/[-_]/g, " ")}
              </h3>
              <p
                style={{ fontSize: "1.1rem", lineHeight: "1.5", color: "#555" }}
              >
                {summary}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
