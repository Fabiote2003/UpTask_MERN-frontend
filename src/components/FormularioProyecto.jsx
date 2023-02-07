import React from 'react';
import { useState } from 'react';
import Alerta from '../components/Alerta';
import { ProyectosProvider } from '../context/ProyectoProvider';
import useProyecto from '../hooks/useProyectos';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import EditarProyecto from '../pages/EditarProyecto';

const FormularioProyecto = () => {

    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion]= useState('');
    const [cliente, setCliente]= useState('');
    const [fechaEntrega, setFechaEntrega]= useState('');
    const params = useParams();
    const {mostrarAlerta, alerta, agregarProyecto, proyecto, editarProyecto} = useProyecto();

    useEffect(() => {
        if(params.id && proyecto.nombre) {
            setNombre(proyecto.nombre);
            setDescripcion(proyecto.descripcion);
            setCliente(proyecto.cliente);
            setFechaEntrega(proyecto.fechaEntrega.split('T')[0]);
        }
    }, [params])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if([nombre, descripcion, cliente, fechaEntrega].includes('')) {
            mostrarAlerta();
            return;
        }

        if(params.id) {
            await editarProyecto({
                nombre,
                descripcion,
                cliente,
                fechaEntrega, 
                id: proyecto._id
            })
        }else {
            await agregarProyecto({
                nombre,
                descripcion,
                cliente,
                fechaEntrega
            })
        }
        
        setNombre('');
        setDescripcion('');
        setFechaEntrega('');
        setCliente('');
    } 
  return (
    <form 
        onSubmit={handleSubmit}
        className='bg-white py-7 px-5 md:w-2/3 rounded-lg shadow'>

        {alerta.msg && <Alerta alerta={alerta} />}
        <div className='my-2'>
            <label className="text-gray-700 upppercas font-bold text-sm md:text-lg"
                   htmlFor='nombre'
            >Nombre Proyecto</label>
            <input  type="text"
                    className='rounded-md border-2 w-full p-2 mt-2 placeholder-gray-400'
                    id='nombre'
                    placeholder='Nombre del proyecto'
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
            />
        </div>
        <div className='my-2'>
            <label className="text-gray-700 upppercas font-bold text-sm md:text-lg"
                   htmlFor='descripcion'
            >Descripción</label>
            <textarea  type="text"
                    className='rounded-md border-2 w-full p-2 mt-2 placeholder-gray-400'
                    id='descripcion'
                    placeholder='Descripción del proyecto'
                    value={descripcion}
                    onChange={e => setDescripcion(e.target.value)}
            />
        </div>
        <div className='my-2'>
            <label className="text-gray-700 upppercas font-bold text-sm md:text-lg"
                   htmlFor='fecha-entrega'
            >Fecha de Entrega</label>
            <input  type="date"
                    className='rounded-md border-2 w-full p-2 mt-2 placeholder-gray-400'
                    id='fecha-entrega'
                    value={fechaEntrega}
                    onChange={e => setFechaEntrega(e.target.value)}
            />
        </div>
        <div className='my-2'>
            <label className="text-gray-700 upppercas font-bold text-sm md:text-lg"
                   htmlFor='cliente'
            >Nombre del cliente</label>
            <input  type="text"
                    className='rounded-md border-2 w-full p-2 mt-2 placeholder-gray-400'
                    id='cliente'
                    placeholder='Nombre del Cliente'
                    value={cliente}
                    onChange={e => setCliente(e.target.value)}
            />
        </div>
        
        <input 
            type="submit"
            value={params.id ? 'Actualizar Proyecto' : 'Crear Proyecto'}
            className="bg-sky-600 w-full p-3 uppercase mt-5 cursor-pointer hover:bg-sky-500 text-white 
            transition-colors font-bold rounded-lg"
        />
    </form>
  )
}

export default FormularioProyecto