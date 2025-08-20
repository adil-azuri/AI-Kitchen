"use client";
import "../app/home.css";

import FileUploadContainer from "@/components/fileUploadContainer";

export default function Home() {

  return (
    <div className="relative min-h-screen">
      <div className="wave-background"></div>
      <div className="relative z-10 flex flex-col items-center justify-center py-5">
        <div className="w-full max-w-3xl mx-auto">
          <h1 className="text-4xl text-center font-bold mb-4">
            Ai Kitchen
          </h1>
          <FileUploadContainer />
        </div>
      </div>
    </div>
  );
}