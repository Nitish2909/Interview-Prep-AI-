import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
  const { user } = useContext(UserContext);

  return (
    <div>
      <Navbar />

      {/* Always render children */}
      <div>{children}</div>
    </div>
  );
};

export default DashboardLayout;
 



// import React, { useContext } from 'react'
// import { UserContext } from '../../context/userContext';
// import Navbar from "./Navbar"

// const DashboardLayout = ({children}) => {

//     const {user} = useContext(UserContext);

//   return (
//     <div>
//         <Navbar/>
//       {user && <div>{children}</div>}
//     </div>
//   )
// }

// export default DashboardLayout
