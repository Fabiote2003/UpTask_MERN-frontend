import useProyecto from "./useProyectos";
import useAuth from "./useAuth";

const useAdmin = () => {
    const { proyecto } = useProyecto();
    const { auth } = useAuth();

    return proyecto.creador === auth._id;
}

export default useAdmin;