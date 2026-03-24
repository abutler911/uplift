import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PostPage from "./pages/PostPage";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import AdminEditor from "./pages/AdminEditor";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/post/:slug" element={<PostPage />} />

        {/* Admin */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/new" element={<AdminEditor />} />
        <Route path="/admin/edit/:id" element={<AdminEditor />} />
      </Routes>
    </BrowserRouter>
  );
}
