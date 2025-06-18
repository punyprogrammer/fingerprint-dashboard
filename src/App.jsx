import React, { useEffect, useState } from "react";
import "./App.css";

const ITEMS_PER_PAGE = 20;

function App() {
  const [fingerprints, setFingerprints] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchFingerprints = async () => {
    try {
      const res = await fetch(
        "https://fingerprint-server-niuu.onrender.com/api/fingerprints"
      );
      const data = await res.json();
      console.log("data", data);
      setFingerprints(data);
    } catch (err) {
      console.error("Failed to fetch fingerprints:", err);
    }
  };

  useEffect(() => {
    fetchFingerprints();
  }, []);

  const paginatedData = fingerprints.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(fingerprints.length / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <h1 className="text-2xl font-bold mb-6 text-black">
        {" "}
        Fingerprint Dashboard
      </h1>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-left text-sm font-semibold text-gray-700">
              <th className="px-4 py-3">Hash</th>
              <th className="px-4 py-3">Last Visited</th>
              <th className="px-4 py-3">Browser</th>
              <th className="px-4 py-3">Time Zone</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {paginatedData.map((fp, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{fp?.hash}</td>
                <td className="px-4 py-2">
                  {new Date(fp.last_visited || fp.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-center">
                  {fp.browser?.userAgent}
                </td>
                <td className="px-4 py-2">{fp.timezone?.timezone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center items-center space-x-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm text-black">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
