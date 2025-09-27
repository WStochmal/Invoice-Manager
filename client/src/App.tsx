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

// --- style ---
import "./index.css";

// --- components ---
import GlobalModal from "./components/common/Modal/GlobalModal";

function App() {
  return (
    <div>
      <InvoiceContextProvider>
        <ModalContextProvider>
          <GlobalModal />
          <Router>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/invoices/form/:id?" element={<InvoiceForm />} />
              </Route>
            </Routes>
          </Router>
        </ModalContextProvider>
      </InvoiceContextProvider>
    </div>
  );
}

export default App;
