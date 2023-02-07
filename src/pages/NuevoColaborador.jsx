import React from 'react'
import FormularioColaborador from '../components/FormularioColaborador';
import {useEffect} from  'react';
import useProyecto from '../hooks/useProyectos';
import { useParams } from 'react-router-dom';
const NuevoColaborador = () => {

    const { obtenerProyecto, proyecto, cargando, colaborador, agregarColaborador} = useProyecto();
    const params = useParams();

    useEffect(() => {
        obtenerProyecto(params.id)
    }, [])

    return (
    <>
        <h1 className='text-4xl font-black '>Añadir Colaborador al proyecto {proyecto.nombre}</h1>

        <div className='mt-10 flex justify-center'>
            <FormularioColaborador />
        </div>

        {cargando ? <p className='text-center'>Cargando...</p> : colaborador?._id && (
            <div className='flex justify-center mt-10'>
                <div className='bg-white py-5 px-5 w-full sm:w-1/2 rounded-lg shadow'>
                        <h2 className='text-center mb-5 text-2xl font-bold'>Resultado: </h2>
                    <div className='flex flex-col items-center'>
                        <p className='font-bold'>{colaborador.nombre}</p>
                        <p className='text-gray-500 mb-3'>{colaborador.email}</p>
                        <button 
                        onClick={() => agregarColaborador({
                            email: colaborador.email
                        })}
                        className='bg-slate-500 px-5 py-2 rounded-lg uppercase text-white font-bols text-sm font-bold'>Agregar al Proyecto</button>
                    </div>
                </div>  
            </div>
        )}
    </>
  )
}

export default NuevoColaborador