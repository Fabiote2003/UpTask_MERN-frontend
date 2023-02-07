import React from 'react';
import { useState } from 'react';
import useProyecto from '../hooks/useProyectos';
import Alerta from './Alerta';
const FormularioColaborador = () => {
    const [email, setEmail] = useState('');
    const {mostrarAlerta, alerta, submitColaborador} = useProyecto();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(email === "") {
            mostrarAlerta();
            return;
        }
        
        await submitColaborador(email);

        setEmail('');
    }

  return (
    <form className='bg-white py-10 px-5 w-full sm:w-1/2 rounded-lg shadow'
          onSubmit={handleSubmit}
    >
        {alerta.msg && <Alerta alerta={alerta}/>}
        <div className='mb-5'>
        <label
              htmlFor='email' 
              className='uppercase text-gray-600 block font-bold text-lg'
            
            >Email Colaborador</label>
            <input 
              id='email'
              type="email"
              placeholder="Email del Colaborador" 
              className='w-full p-3 border rounded-xl bg-gray-50'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
        </div>
        <input 
            type="submit"
            value="Agregar Colaborador"
            className="bg-sky-600 w-full p-3 uppercase mt-5 cursor-pointer hover:bg-sky-500 text-white 
            transition-colors font-bold rounded-lg"
        />
    </form>
  )
}

export default FormularioColaborador