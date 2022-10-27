import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './pages/Header';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import MatchingHistoryPage from './pages/MatchingHistoryPage';
import RoomListPage from './pages/RoomListPage';
import SelectPage from './pages/SelectPage';
import TempRandom from './pages/TempRandom';

const App = () => {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="select" element={<SelectPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="lunch/room" element={<RoomListPage />} />
        <Route path="lunch/random" element={<TempRandom />} />
        <Route
          path="mypage/matching_history"
          element={<MatchingHistoryPage />}
        />
      </Routes>
    </div>
  );
};

export default App;
