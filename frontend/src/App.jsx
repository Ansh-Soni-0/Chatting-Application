import { useEffect } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import SettingPage from "./pages/SettingPage"
import ProfilePage from "./pages/ProfilePage"
import { useAuthStore } from "./store/useAuthStore"
import { Loader } from "lucide-react"
import { Toaster } from "react-hot-toast"
import { useThemeStore } from "./store/useThemeStore"

const App = () => {


  const {authUser , checkAuth , isCheckingAuth} = useAuthStore()

  const { theme } = useThemeStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  
  // console.log({authUser})

  if(isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )

  return (
    <div>
      
        <Navbar /> 

        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login"/>}/>
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/"/>}/>
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/"/>}/>
          <Route path="/settings" element={<SettingPage />}/>
          <Route path="/profile" element={authUser ?  <ProfilePage /> : <Navigate to="/login"/>}/>
        </Routes>

        <Toaster />
    </div>
  )
}

export default App