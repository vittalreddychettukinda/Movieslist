import React from "react";
export const ApiUrl = "http://localhost:3000";  
export function Auth() {
    return (
      <div>
        <h1>API URL is: {ApiUrl}</h1>
      </div>
    );
  }