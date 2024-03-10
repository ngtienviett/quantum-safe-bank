import { Suspense } from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainRoute from "./routers/MainRoute";

function App() {
  return (
    <Suspense fallback={<></>}>
      <BrowserRouter>
        <AuthProvider>
          <MainRoute />
        </AuthProvider>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
