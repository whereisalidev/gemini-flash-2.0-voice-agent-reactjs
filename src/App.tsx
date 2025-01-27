import { useState } from "react";
import "./App.scss";
import { LiveAPIProvider } from "./contexts/LiveAPIContext";
import ControlTray from "./components/control-tray/ControlTray";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY as string;
if (typeof API_KEY !== "string") {
  throw new Error("set REACT_APP_GEMINI_API_KEY in .env");
}

const host = "generativelanguage.googleapis.com";
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;

// SubtlePulse Component
// const SubtlePulse = () => {
//   const subtlePulse = `
//     @keyframes subtlePulse {
//       0% { opacity: 0.8; }
//       50% { opacity: 0.95; }
//       100% { opacity: 0.8; }
//     }

//     @keyframes subtlePing {
//       0% { transform: scale(1); opacity: 0.3; }
//       100% { transform: scale(1.1); opacity: 0; }
//     }
//   `;

  // return (
  //   <div className="flex items-center gap-3 w-40 mx-auto">
  //     <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center relative">
  //       {/* Inner circle with pulse animation */}
  //       <div
  //         className="w-6 h-6 rounded-full bg-white/90"
  //         style={{
  //           animation: 'subtlePulse 2s ease-in-out infinite',
  //         }}
  //       ></div>

  //       {/* Outer gradient circle with ping animation */}
  //       <div
  //         className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
  //         style={{
  //           animation: 'subtlePing 2s ease-in-out infinite',
  //         }}
  //       ></div>

  //       {/* Injecting animations */}
  //       <style>{subtlePulse}</style>
  //     </div>
  //   </div>
  // );
// };

function App() {
  return (
    <div className="App">
      <LiveAPIProvider url={uri} apiKey={API_KEY}>
        <div className="streaming-console">
          <main>
            {/* Add the SubtlePulse component here */}
            {/* <SubtlePulse /> */}
            <ControlTray supportsVideo={false}>
              {/* No need for video-related buttons */}
            </ControlTray>
            
          </main>
        </div>
      </LiveAPIProvider>
    </div>
  );
}

export default App;
