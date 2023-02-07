import React from 'react'
import useProyecto from '../hooks/useProyectos';
import Swal from 'sweetalert2';

const Colaborador = ({colaborador}) => {
    const {eliminarColaborador} = useProyecto();
    const {nombre, email, _id} = colaborador;

    const handleDelete = (id) => {
        Swal.fire({
            title: `Estasa seguro de eliminar a ${nombre} del proyecto?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: "Cancelar",
            confirmButtonText: 'Si, eliminar!'
          }).then(async (result) => {
            if (result.isConfirmed) {
              await eliminarColaborador(id);
             
            }
          })
    }

  return (
    <div className='border-b p-5 flex justify-between items-center bg-white rounded-lg shadow'>
        <div>
            <p className='font-bold'>{nombre}</p>
            <p className='text-sm text-gray-700 '>{email}</p>
        </div>

        <div>
            <button
                type='button'
                className='bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg'
                onClick={() => handleDelete(_id)}
            >
                Eliminar
            </button>
        </div>
    </div>
  )
}

export default Colaborador