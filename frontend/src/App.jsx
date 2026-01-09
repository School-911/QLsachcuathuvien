import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import Home from "./pages/Home";
import BookPage from "./pages/BookPage";
import Users from "./pages/UserPage";
import Borrow from "./pages/Borrow";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="books" element={<BookPage />} />
          <Route path="users" element={<Users />} />
          <Route path="borrows" element={<Borrow />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
