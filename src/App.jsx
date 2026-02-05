import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SymptomReview from "./pages/SymptomReview";
import Departments from "./pages/Departments";
import Doctors from "./pages/Doctors";
import MatchingRules from "./pages/MatchingRules";
import UserManagement from "./pages/UserManagement";
import PageNotFound from "./pages/PageNotFound";
import AdminLayout from "./components/layout/AdminLayout";
import Settings from "./pages/Settings";
import ViewUser from "./pages/ViewUser";


function App(){
  return(
    <>
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/symptoms" element={<SymptomReview />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/user-settings" element={<UserManagement />} />
        <Route path="/user/:id" element={<ViewUser />} />
        <Route path="/rules" element={<MatchingRules />} />
        {/* <Route path="/settings" element={<Settings />} /> */}
      </Route>
      <Route path="/*" element={<PageNotFound />} />
    </Routes>
  </>
  )
  
}

export default App
