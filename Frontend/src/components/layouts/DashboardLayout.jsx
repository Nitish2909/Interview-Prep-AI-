import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
  const { user } = useContext(UserContext);

  return (
    <div>
      <Navbar />

      {/* Always render children */}
      <div className="min-h-screen">{children}</div>
    </div>
  );
};

export default DashboardLayout;
 