// --- lib ---
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// --- pages ---
import Dashboard from "./pages/Dashboard/Dashboard";
import Invoices from "./pages/Invoices/Invoices";
import InvoiceForm from "./pages/InvoiceForm/InvoiceForm";

// --- layout ---
import AppLayout from "./layout/AppLayout";

// --- context ---
import { InvoiceContextProvider } from "./context/InvoiceContext";
import { ModalContextProvider } from "./context/ModalContext";
import { LanguageContextProvider } from "./context/LanguageContext";
// --- style ---
import "./index.css";

// --- components ---
import GlobalModal from "./components/common/Modal/GlobalModal";

function App() {
  return (
    <div>
      <Router>
        <LanguageContextProvider>
          <InvoiceContextProvider>
            <ModalContextProvider>
              <GlobalModal />

              <Routes>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/invoices/form/:id?" element={<InvoiceForm />} />
                </Route>
              </Routes>
            </ModalContextProvider>
          </InvoiceContextProvider>
        </LanguageContextProvider>
      </Router>
    </div>
  );
}

export default App;
