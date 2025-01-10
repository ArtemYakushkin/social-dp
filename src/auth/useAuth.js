import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Сохраняем полный объект пользователя Firebase
        localStorage.setItem("user", JSON.stringify(user)); // Сохраняем пользователя в localStorage
      } else {
        setUser(null);
        localStorage.removeItem("user"); // Удаляем данные пользователя из localStorage
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = () => {
    auth.signOut().then(() => {
      setUser(null);
      localStorage.removeItem("user"); // Удаляем данные пользователя из localStorage при логауте
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
      navigate("/");
    });
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);