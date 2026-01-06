import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notes from "./pages/Notes";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Login />} />

            <Route 
                path="/notes"
                element={
                    <ProtectedRoute>
                        <Notes />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
