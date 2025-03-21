import React, { useState } from "react";
import Bread from "./Bread";
import ColdDrinks from "./ColdDrinks";

const items = {
  Bread: <Bread />,
  ColdDrinks: <ColdDrinks />,
};

const App = () => {
  const [activeTab, setActiveTab] = useState(Object.keys(items)[0]); // Default to the first category

  return (
    <div className="p-4">
      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b-2 pb-2">
        {Object.keys(items).map((category) => (
          <button
            key={category}
            className={`px-4 py-2 ${
              activeTab === category ? "bg-blue-500 text-white" : "bg-gray-200"
            } rounded`}
            onClick={() => setActiveTab(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Render Active Component */}
      <div className="mt-4">{items[activeTab]}</div>
    </div>
  );
};

export default App;
