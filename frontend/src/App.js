import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Root from './components/Root/Root';
import Home from './components/Home/Home';
import Profile from './components/Profile/Profile';
import Login from './components/Login/Login';
import Logout from './components/Login/Logout';
import Register from './components/Register/Register';
import Exercises from './components/Exercises/Exercises';
import History from './components/History/History';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="exercises" element={<Exercises />} />
          <Route path="history" element={<History />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="logout" element={<Logout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
