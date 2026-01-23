import { BrowserRouter } from "react-router-dom";
import AppRouter from "@app/router/AppRouter";
import { ToastProvider } from "@shared/context/ToastContext";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </BrowserRouter>
  );
}

