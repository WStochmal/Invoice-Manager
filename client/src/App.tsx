import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import AppLayout from "./layout/AppLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import { Invoices } from "./pages/Invoices/Invoices";
import InvoiceDetails from "./pages/InvoiceDetails/InvoiceDetails";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/invoices/:id" element={<InvoiceDetails />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
