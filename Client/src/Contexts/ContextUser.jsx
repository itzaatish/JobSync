import { createContext, useState, useEffect } from 'react';

const UserContext = createContext({});
export default UserContext;

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    user_id: "",
    name: "",
    mail_id: ""
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const getData = (userId, name, mailId) => {
    const newUser = {
      user_id: userId,
      name: name,
      mail_id: mailId
    };
    setUser(newUser);
    localStorage.setItem("userData", JSON.stringify(newUser)); 
  };

  const clearData = () => {
    setUser({
      user_id: "",
      name: "",
      mail_id: ""
    });
    localStorage.removeItem("userData"); 
  };

  return (
    <UserContext.Provider value={{ user, getData, clearData }}>
      {children}
    </UserContext.Provider>
  );
};
