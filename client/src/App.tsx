import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import AppLayout from "./layout/AppLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import { Invoices } from "./pages/Invoices/Invoices";
import InvoiceForm from "./pages/InvoiceForm/InvoiceForm";
import { InvoiceContextProvider } from "./context/InvoiceContext";

function App() {
  return (
    <div>
      <InvoiceContextProvider>
        <Router>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/invoices/form/:id?" element={<InvoiceForm />} />
            </Route>
          </Routes>
        </Router>
      </InvoiceContextProvider>
    </div>
  );
}

export default App;
