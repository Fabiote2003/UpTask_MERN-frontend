import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Alerta from '../components/Alerta';
import clienteAxios from '../config/clienteAxios';

const OlvidePassword = () => {
  const [email, setEmail] = useState('');
  const [alerta, setAlerta] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(email === '') {
      setAlerta({
        msg: "Necesitas ingresar tu email para restablecer tu contraseña.",
        error: true
      })
      return;
    }
    setAlerta({}); 

    try {
      const {data} = await clienteAxios.post('/usuarios/olvide-password', {email});
      setAlerta({
        msg: data.msg,
        error: false
      })
    } catch (error) {
      console.log(error);
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  } 

  const {msg} = alerta;

  return (
    <>
      <h1 className='text-sky-600 font-black text-5xl md:text-6xl capitalize text-center'>Recupera tu acceso y no pierdas tus
        <span className='text-slate-700'> proyectos</span>
      </h1>
      {msg && <Alerta alerta={alerta}/>}
      <form 
      className='my-5 bg-white shadow rounded p-5 md:p-10'
      onSubmit={handleSubmit}
      >
          <div className='my-2 md:my-5'>
            <label
              htmlFor='email' 
              className='uppercase text-gray-600 block font-bold text-lg'
            
            >Email</label>
            <input 
              id='email'
              type="email"
              placeholder="Email de Registro" 
              className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <input 
            type="submit"
            value="Recuperar Contraseña"
            className="w-full bg-sky-700 py-3 text-lg	text-white uppercase font-bold cursor-pointer hover:bg-sky-800 transition-colors rounded mb-5 mt-3 md:mt-0"

          />
      </form>

      <nav className='lg:flex lg:justify-between mb-3'>
          <p className="text-slate-600 uppercase font-medium">¿Tienes una cuenta? <Link to="registrar" className="font-bold text-sky-700 hover:underline">Inicia Sesión</Link>.</p>
      </nav>
    </>
  )
}

export default OlvidePassword