import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import { Navigate } from 'react-router-dom';
import MovieDetails from './components/MovieDetails/MovieDetails';
import VideoPlayer from './components/VideoPlayer/VideoPlayer';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={
                <>
                  <Dashboard />
                </>
              }
            />
          </Route>
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/watch/:id" element={<VideoPlayer />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
