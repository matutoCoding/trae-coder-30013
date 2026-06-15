import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BatchDrawerProvider } from '@/contexts/BatchDrawerContext';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Materials from '@/pages/Materials';
import Pulping from '@/pages/Pulping';
import Lifting from '@/pages/Lifting';
import Drying from '@/pages/Drying';
import Inspection from '@/pages/Inspection';
import Orders from '@/pages/Orders';
import Traceability from '@/pages/Traceability';

export default function App() {
  return (
    <BatchDrawerProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/pulping" element={<Pulping />} />
            <Route path="/lifting" element={<Lifting />} />
            <Route path="/drying" element={<Drying />} />
            <Route path="/inspection" element={<Inspection />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/traceability" element={<Traceability />} />
          </Route>
        </Routes>
      </Router>
    </BatchDrawerProvider>
  );
}
