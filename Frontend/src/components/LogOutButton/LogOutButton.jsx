import React from "react";
import Button from "../Button/Button";

const LogOutButton = (props) => {

  
  return (
    <div>
      <div
        style={{
          width: "150px",
          height: "60px",
          position: "absolute",
          right: "60px",
          top: "0px",
          borderRadius: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Button
          type={"button-black"}
          text="Log Out"
          onClick={()=>props.onClick()}
       
        />
      </div>
    </div>
  );
};

export default LogOutButton;
