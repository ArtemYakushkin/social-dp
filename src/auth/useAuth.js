// import { useState, useEffect, createContext, useContext } from "react";
// import { auth } from "../firebase";
// import { onAuthStateChanged } from "firebase/auth";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     // Загружаем пользователя из localStorage при инициализации
//     const storedUser = localStorage.getItem("user");
//     return storedUser ? JSON.parse(storedUser) : null;
//   });

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         const userData = {
//           uid: user.uid,
//           displayName: user.displayName,
//           photoURL: user.photoURL,
//           email: user.email,
//         };
//         setUser(userData);
//         localStorage.setItem("user", JSON.stringify(userData)); // Сохраняем пользователя в localStorage
//       } else {
//         setUser(null);
//         localStorage.removeItem("user"); // Удаляем данные пользователя из localStorage
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const logout = () => {
//     auth.signOut().then(() => {
//       setUser(null);
//       localStorage.removeItem("user"); // Удаляем данные пользователя из localStorage при логауте
//     });
//   };

//   return (
//     <AuthContext.Provider value={{ user, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import { useState, useEffect, createContext, useContext } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

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
    });
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);