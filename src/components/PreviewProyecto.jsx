import React from 'react'
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PreviewProyecto = ({proyecto}) => {
    const {auth} = useAuth();

    const {nombre, _id, cliente, creador} = proyecto;

  return (
    <div className='border-b flex flex-col md:flex-row p-5 items-center gap-2 md:gap-10'>
        
        <div className='flex-1 flex text-center md:text-left flex-col md:flex-row'>
            <p className='flex-1'>
                {nombre}

                <span className='text-sm text-gray-400 uppercase font-semibold'> {''} {cliente}</span>
            </p>
            {auth._id !== creador._id &&(
                <p className='bg-green-500 text-sm p-2 rounded-lg uppercase font-bold text-white sm:flex sm:items-center sm:justify-center'>Colaborador</p>
            )}
        </div>
        <Link to={`${_id}`}
            className="text-gray-600 hover:text-gray-800 uppercase text-sm font-bold"
        >
            Ver Proyecto
        </Link>
    </div>
  )
}

export default PreviewProyecto