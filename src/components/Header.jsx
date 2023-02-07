import React from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth';
import useProyecto from '../hooks/useProyectos';
import Busqueda from './Busqueda';

const Header = () => {

    const {handleBuscador, cerrarSesiónProyectos} = useProyecto();
    const {cerrarSesionAuth} = useAuth();

    const handleCerrarSesion = () => {
        cerrarSesionAuth();
        cerrarSesiónProyectos();
        localStorage.removeItem('token');
    }

  return (
    <header className='px-4 py-5 bg-white border-b'>
        <div className='md:flex md:justify-between'>
            <h2 className='text-4xl text-sky-600 font-black text-center mb-5 md:mb-0'>UpTask</h2>
            <div className='flex flex-col md:flex-row items-center gap-4'>
                <button
                    type='button'
                    className='font-bold uppercase'
                    onClick={handleBuscador}
                >
                    Buscar Proyecto
                </button>
                <Link to="/proyectos"
                      className='font-bold uppercase hover:underline hover:text-sky-900'
                >Proyectos
                </Link>

                <button type='button'
                    className='text-white text-sm bg-sky-700 p-3 rounded-md uppercase font-bold'
                    onClick={handleCerrarSesion}
                >
                    Cerrar Sesión
                </button>
                <Busqueda />
            </div>
        </div>
    </header>
  )
}

export default Header