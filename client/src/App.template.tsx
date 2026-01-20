import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import "./App.css";

interface ApiResponse {
  message: string;
  timestamp: string;
}

function App() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/hello");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result: ApiResponse = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>SDDLabs</h1>
        <p>React TypeScript + Express API</p>
      </header>

      <main className="app-main">
        <Routes>
          {/* Feature routes will be added here */}
          <Route
            path="/"
            element={
              <div className="card">
                <h2>API Response</h2>
                {loading && <p className="loading">Loading...</p>}
                {error && <p className="error">Error: {error}</p>}
                {data && (
                  <div className="data">
                    <p>
                      <strong>Message:</strong> {data.message}
                    </p>
                    <p>
                      <strong>Timestamp:</strong> {data.timestamp}
                    </p>
                  </div>
                )}
                <button onClick={fetchData} disabled={loading}>
                  Refresh Data
                </button>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
