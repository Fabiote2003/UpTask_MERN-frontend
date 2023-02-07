import React from 'react'
import { formatearFecha } from '../helpers/formatearFecha';
import useProyecto from '../hooks/useProyectos';
import Swal from 'sweetalert2'
import useAdmin from '../hooks/useAdmin';
const Tarea = ({tarea}) => {
  const { handleModalEditarTarea, eliminarTarea, completarTarea } = useProyecto();
  const {descripcion, nombre, prioridad, fechaEntrega, estado, _id} = tarea;
  const admin = useAdmin();

  const handleDelete = (e) => {
    e.preventDefault();
    Swal.fire({
        title: 'Estas seguro de eliminar la tarea?',
        text: "No vas a poder recuperarla!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: "Cancelar",
        confirmButtonText: 'Si, eliminar!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          await eliminarTarea(tarea);
          Swal.fire(
            '¡Eliminada!',
            'Tarea eliminada correctamente.',
            'success'
          )
        }
      })
  }
  return (
    <div className='border-b p-5 flex flex-col sm:flex-row gap-4 justify-between items-center my-2 bg-white rounded-lg shadow'>
        <div className='flex justify-start flex-col item-start'>
            <p className='mb-1 text-xl '>{nombre}</p>
            <p className='mb-1 text-sm text-gray-500 uppercase'>{descripcion}</p>
            <p className='mb-1 text-xl '>{formatearFecha(fechaEntrega)}</p>
            <p className='mb-1 text-gray-600'>Prioridad: {prioridad}</p>
            {estado && <p className='text-xs bg-green-600 w-44 rounded-lg uppercase font-bold text-white mx-auto text-center p-1 mt-2'>Completado por: {tarea.completado.nombre}</p>}
        </div>

        <div className='flex gap-2 flex-wrap sm:flex-col md:flex-row justify-center'>
          {admin && (
              <button
                  className='bg-indigo-600 px-4 text-white uppercase font-bold text-sm rounded-lg py-3'
                  onClick={() => handleModalEditarTarea(tarea)}
              >
                  Editar
              </button>
          )}

            
                    <button
                        className={`${estado ? 'bg-sky-600' : 'bg-gray-600'} px-4 text-white uppercase font-bold text-sm rounded-lg py-3`}
                        onClick={() => completarTarea(_id)}

                    >
                        {estado ? 'Completa' : 'Incompleta'}
                    </button>
          
             
            {admin && (
              <button
                  className='bg-red-500 px-4 text-white uppercase font-bold text-sm rounded-lg py-3'
                  onClick={handleDelete}
              >
                  Eliminar
              </button>
            )}
        </div>
    </div>
  )
}

export default Tarea