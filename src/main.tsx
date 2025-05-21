
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import ErrorBoundary from "./utils/ErrorBoundary.tsx";
import { Toaster } from "react-hot-toast";
import{AuthProvider} from "./context/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
createRoot(document.getElementById("root")!).render(
  <>
  <BrowserRouter>
    <Toaster position="top-right" />
    <ErrorBoundary>
      <AuthProvider>

    <App/>
      </AuthProvider>
    </ErrorBoundary>
  </BrowserRouter>
  </>
);
