import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Companies from './pages/Companies';
import CompanyProfile from './pages/CompanyProfile';
import Lists from './pages/Lists';
import SavedSearches from './pages/SavedSearches';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/companies" replace />} />
        <Route path="companies" element={<Companies />} />
        <Route path="companies/:id" element={<CompanyProfile />} />
        <Route path="lists" element={<Lists />} />
        <Route path="saved" element={<SavedSearches />} />
      </Route>
    </Routes>
  );
}
