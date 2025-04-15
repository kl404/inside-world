import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import "./index.css";
import Dashboard from "./components/Dashboard";
import Hero from "./components/Hero";
import Logout from "./components/Logout";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="w-full max-w-[1000px] mx-auto text-sm sm:text-base min-h-screen flex flex-col font-[Open_Sans]">
          <header className="p-4 sm:p-8 flex items-center justify-between gap-4">
            <Link
              to="/"
              className="text-base sm:text-lg textGradient fugaz-font"
            >
              Mood
            </Link>
            <Logout />
          </header>

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>

          <footer className="sm:p-1 grid place-items-center">
            <a
              href="https://nfthomeland.github.io/"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-500 duration-200 hover:text-white hover:bg-indigo-500 fugaz-font"
            >
              NFT 🏡
            </a>
            <a
              href="https://mouthamaz.github.io/"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-500 duration-200 hover:text-white hover:bg-indigo-500 fugaz-font"
            >
              Mouth 🤩
            </a>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
