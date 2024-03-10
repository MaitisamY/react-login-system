import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './components/Login'
import Signup from './components/Signup'
import Account from './components/Account'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
    return (
      <main>
          <Router>
              <Routes>
                  <Route path="/account" element={<Account />} />
                  <Route path="/" element={<Login />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
              </Routes>
          </Router>
      </main>
    )
}

export default App
