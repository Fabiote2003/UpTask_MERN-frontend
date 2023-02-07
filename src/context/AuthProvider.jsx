import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";

const AuthContext = createContext();

const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState({})
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const obtenerInfoUsuario = async () => {
            const token = localStorage.getItem('token');
            if(!token) {
                setCargando(false);
                return;
            }
            
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            try {
                
                const {data} = await clienteAxios.get('/usuarios/perfil', config);
                setAuth(data);
                
                } catch (error) {
                    setAuth({});
                }

                setCargando(false);
        }

        obtenerInfoUsuario();
    }, [])

    const cerrarSesionAuth = () => {
        setAuth({});
    }

    return (
        <AuthContext.Provider
            value={{
                setAuth,
                auth,
                cargando,
                cerrarSesionAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}


export {
    AuthProvider
}

export default AuthContext;