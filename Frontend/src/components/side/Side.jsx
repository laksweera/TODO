import React from "react";
import "./side.css";
import { FaRegUser } from "react-icons/fa";
import SidebarButton from "./SidebarButton";
const Side = () => {
  return (
    <div className="sidebarContainer">
      <div style={{ marginTop: "30px" }}>
        <SidebarButton buttonType={"Tasks"} selected={true} />
      </div>
    </div>
  );
};

export default Side;
