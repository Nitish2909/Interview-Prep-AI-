import React, { useState } from "react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const response = await axiosInstance.post(
      API_PATHS.AI.GENERATE_EXPLANATION,
      {
        question: query,
      },
    );
    setResponse(response.data.explanation);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">
        {/* Center Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          {!response ? <h2 className="text-3xl md:text-4xl font-semibold mb-10 text-center">
            What can I help with?
          </h2>: 
          <div className="col-span-12 md:col-span-5">
            <div className="bg-white border rounded-xl shadow-md p-4 sticky top-5">
              <div className="flex items-center justify-between mb-3">
                {/* <h3 className="text-lg font-semibold">Explanation</h3> */}
              </div>

              <div className="max-h-[70vh] overflow-y-auto whitespace-pre-line text-gray-700">
                {response}
              </div>
            </div>
          </div>
          }

          {/* Input Box */}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl bg-[#1f1f1f] border border-white/10 rounded-2xl flex items-center px-4 py-3 shadow-lg"
          >
            <input
              type="text"
              placeholder="Message..."
              name="question"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 outline-none bg-[#1f1f1f] text-white "
              autoComplete="off"
            />

            <button
              type="submit"
              className="ml-3 px-4 py-2 rounded-xl bg-white text-black font-medium hover:bg-gray-200 transition"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SearchPage;
