import {createContext, useState, useEffect} from "react";
import clienteAxios from "../config/clienteAxios";
import {useNavigate} from 'react-router-dom'
import useAuth from "../hooks/useAuth";
import Swal from 'sweetalert2'
import io from "socket.io-client";

let socket;

const ProyectoContext = createContext();

const ProyectosProvider = ({children}) => {

    const [proyectos, setProyectos] = useState([]);
    const [alerta, setAlerta] = useState({});
    const [proyecto, setProyecto] = useState({});
    const [cargando, setCargando] = useState(false);
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false);
    const [tarea, setTarea] = useState({});
    const [colaborador, setColaborador] = useState({});
    const [buscador, setBuscador] = useState(false);

    const navigate = useNavigate();
    const {auth} = useAuth();
    const mostrarAlerta = () => {
        setAlerta({
            msg: "Todos los campos son obligatorios.",
            error: true
        })

        setTimeout(() => {
            setAlerta({});
        }, 3000);
    }

    const agregarProyecto = async (proyecto) => {
        const token = localStorage.getItem('token');
        if(!token) {
            return;
        }

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        try {
            const {data} = await clienteAxios.post('/proyectos/', proyecto, config);
            setProyectos([...proyectos, data]);
            
            setAlerta({
                msg: "Proyecto creado correctamente",
                error: false
            });

            setTimeout(() => {
                navigate("/proyectos")
                setAlerta({})
            }, 2000);
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const editarProyecto = async (proyecto) => {
        const {nombre, cliente, fechaEntrega, descripcion} = proyecto;
        const token = localStorage.getItem('token');
            if(!token) {
                return;
            }

            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };


        try {
            const {data} = await clienteAxios.put(`/proyectos/${proyecto.id}`,
            {nombre, cliente, fechaEntrega, descripcion},
            config);

            const proyectosActualizados = proyectos.map(proyecto => proyecto._id === data._id ? data : proyecto);
            setProyectos(proyectosActualizados)

            setAlerta({
                msg: "Proyecto actualizado correctamente",
                error: false
            });
            setTimeout(() => {
                navigate(-1);
                setAlerta({});
            }, 1000);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const obtenerProyectos = async () => {
            const token = localStorage.getItem('token');
            if(!token) {
                return;
            }

            const config = {
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` }
            };

            try {
                const {data} = await clienteAxios.get('/proyectos', config);
                setProyectos(data);
            } catch (error) {
                console.log(error);
                setAlerta({
                    msg: error.response.data.msg,
                    error: true
                })
            }
        }
        obtenerProyectos();
    }, [auth, proyecto])

    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL);
    }, [])

    const obtenerProyecto = async (id) => {
        setCargando(true);
        const token = localStorage.getItem('token');
        if(!token) {
            return;
        }
        
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        try {
            const {data} = await clienteAxios.get(`/proyectos/${id}`, config);
            setProyecto(data);
        } catch (error) {
            navigate('/proyectos')
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        } finally {
            setCargando(false);
        }
    } 

    const eliminarProyecto = async (id) => {
        const token = localStorage.getItem('token');
        if(!token) {
            return;
        }
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        try {
            const {data} = await clienteAxios.delete(`/proyectos/${id}`, config);
            const proyectosActualizados = proyectos.filter(proyecto => proyecto._id !== id);
            setProyectos(proyectosActualizados);
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            });
        }

    }

    const handleFormularioTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea);
        setTarea({})
    }

    const submitTarea = async (tarea) => {
        if(tarea?.id) {
            await editarTarea(tarea);
        }else {
            await crearTarea(tarea);
        }
        
    }

    const crearTarea = async (tarea) => {
        const token = localStorage.getItem('token');
        if(!token) {
            return;
        }        

        const config = {
            headers: {
                 Authorization: `Bearer ${token}` 
            }
        }

        try {
            const {data} = await clienteAxios.post('/tareas', tarea, config);
            
            //Alerta
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'La tarea ha sido agregada.',
                showConfirmButton: false,
                timer: 1500
              });
            handleFormularioTarea();

            //SOCKET IO
            socket.emit('nueva tarea', data)
        } catch (error) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: error.response.data.msg,
                showConfirmButton: false,
                timer: 1500
              });
              handleFormularioTarea();
        }
    }

    const editarTarea = async (tarea) => {
        const token = localStorage.getItem('token');
        if(!token) {
            return;
        }        

        const config = {
            headers: {
                 Authorization: `Bearer ${token}` 
            }
        }

        try {
            const {data} = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config);
            setModalFormularioTarea(false)
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: '¡La tarea ha sido actualizada!',
                showConfirmButton: false,
                timer: 1000
              });
            const proyectoActualizado = {...proyecto}
            proyectoActualizado.tareas = proyectoActualizado.tareas?.map(tareaItem => tareaItem._id === data._id ? data : tareaItem);
            setProyecto(proyectoActualizado);
            
            //SOCKET
            socket.emit('actualizar tarea', data);
        } catch (error) {
            console.log(error); 
        }

    }

    const handleModalEditarTarea = (tarea) => {
        setTarea(tarea);
        setModalFormularioTarea(true);
    }


    const eliminarTarea = async (tarea) => {
        console.log(tarea)
        const token = localStorage.getItem('token');
        if(!token) {
            return;
        }        
        const config = {    
            headers: {
                 Authorization: `Bearer ${token}` 
            }
        }

        try {
            const res = await clienteAxios.delete(`/tareas/${tarea._id}`, config);

            //SOCKET
            socket.emit('eliminar tarea', tarea);

            setTarea({});
        } catch (error) {
            console.log(error);
        }
    }

    const submitColaborador = async (email) => {
        setCargando(true);
        const token = localStorage.getItem('token');
        if(!token) {
            return;
        }        
        const config = {
            headers: {
                 Authorization: `Bearer ${token}` 
            } 
        }

        try {
            const {data} = await clienteAxios.post('/proyectos/colaboradores', {email}, config);
            setColaborador(data);
            setAlerta({});
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
        setCargando(false);
    }

    const agregarColaborador = async email => {
        const token = localStorage.getItem('token');
        if(!token) {
            return;
        }        
        const config = {
            headers: {
                 Authorization: `Bearer ${token}` 
            } 
        }

        try {
            const {data} = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config);
            setAlerta({
                msg: data.msg,
                error: false
            });
            setColaborador({});
            setAlerta({
                msg: "Colaborador agregado Correctamente",
                error: false
            });

            setTimeout(() => {
                navigate(-1);
                setAlerta({});
            }, 2000);
        } catch (error) {
            console.log(error);
            setAlerta({
                msg: error.response.data.msg,
                error: true
            });
        }
    }

    const eliminarColaborador = async id => {
        const token = localStorage.getItem('token');
        if(!token) {
            return;
        }        
        const config = {
            headers: {
                 Authorization: `Bearer ${token}` 
            } 
        }
        try {
            const {data} = await clienteAxios.post(`/proyectos/eliminar-colaboradores/${proyecto._id}`, {id}, config);
            const proyectoActualizado = {...proyecto};
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter((colaborador) => colaborador._id !== id);
            setProyecto(proyectoActualizado);
            Swal.fire(
                'Eliminado!',
                `${data.msg}`,
                'success'
              )
        } catch (error) {
            Swal.fire(
                'Ocurrio un error!',
                'No se pudo eliminar el colaborador.',
                'error'
              )
        }
    }

    const completarTarea = async id => {
        try {
            const token = localStorage.getItem('token');
            if(!token) {
                return;
            }        
            const config = {
                headers: {
                    Authorization: `Bearer ${token}` 
                } 
            }  

            const {data} = await clienteAxios.post(`/tareas/estado/${id}`, {}, config);
            

            //SOCKET
            socket.emit('completar tarea', data);

        } catch (error) {
            console.log(error.response)
        }
    }

    const handleBuscador = () => {
        setBuscador(!buscador)
    }

    //Socket io 
    const submitTareasProyecto = (tarea) => {
        const proyectoActualizado = {...proyecto};
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]
        setProyecto(proyectoActualizado);
    }

    const eliminarTareaProyecto = tarea => {
        const proyectoActualizado = {...proyecto};
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id);
        setProyecto(proyectoActualizado);
    }

    const actualizarTareaProyecto = (tareaActualizada) => {
        const proyectoActualizado = {...proyecto};
        proyectoActualizado.tareas = proyectoActualizado.tareas?.map(tareaItem => tareaItem._id === tareaActualizada._id ? tareaActualizada : tareaItem);
        setProyecto(proyectoActualizado);
    }

    const completarTareaProyecto = (tareaCompletada) => {
        const proyectoActualizado = {...proyecto};
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tarea => tarea._id === tareaCompletada._id ? tareaCompletada : tarea);
        setProyecto(proyectoActualizado);
    }

    const cerrarSesiónProyectos = () => {
        setProyectos([]);
        setProyecto({});
        setAlerta({});

    }

    return (
        <ProyectoContext.Provider
            value={{
                proyectos,
                mostrarAlerta,
                alerta,
                agregarProyecto,
                obtenerProyecto,
                proyecto,
                cargando,
                editarProyecto,
                eliminarProyecto,
                handleFormularioTarea,
                modalFormularioTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                eliminarTarea,
                submitColaborador,
                colaborador,
                agregarColaborador,
                eliminarColaborador,
                completarTarea,
                handleBuscador, 
                buscador,
                submitTareasProyecto,
                eliminarTareaProyecto,
                actualizarTareaProyecto,
                completarTareaProyecto,
                cerrarSesiónProyectos
            }}
        >
            {children}
        </ProyectoContext.Provider>
    )
}

export {
    ProyectosProvider
}

export default ProyectoContext;