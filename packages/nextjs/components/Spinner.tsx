"use client";

import React from "react";

export function Spinner() {
  return (
    <div className="fixed inset-0 bg-base-300 bg-opacity-75 flex justify-center items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
    </div>
  );
}
