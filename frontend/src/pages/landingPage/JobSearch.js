import React, { useState } from "react";

const JobSearch = () => {
  const [filters, setFilters] = useState({
    time: "",
    type: "",
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      // Construct URL with query parameters
      const url = new URL("/api/jobs/search", window.location.origin);
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          url.searchParams.append(key, filters[key]);
        }
      });

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message || "Error fetching job data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Job Search</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          className="flex-1 border p-2 rounded"
          value={filters.time}
          onChange={(e) => setFilters((prev) => ({ ...prev, time: e.target.value }))}
        >
          <option value="">Select Time</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Freelance">Freelance</option>
        </select>
        <select
          className="flex-1 border p-2 rounded"
          value={filters.type}
          onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
        >
          <option value="">Select Type</option>
          <option value="Remote">Remote</option>
          <option value="On-Site">On-Site</option>
          <option value="Hybrid">Hybrid</option>
        </select>
        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div>
        {results.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((job) => (
              <div key={job.id} className="border p-4 rounded shadow-md">
                <h2 className="font-bold text-lg mb-2">{job.title}</h2>
                <p className="text-gray-600 mb-1">{job.company}</p>
                <p className="text-sm mb-2">{job.location}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{job.time}</span>
                  <span>{job.type}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No jobs found. Adjust your filters and try again!</p>
        )}
      </div>
    </div>
  );
};

export default JobSearch;