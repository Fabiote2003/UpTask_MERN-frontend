import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Alerta from '../components/Alerta'
import { useEffect } from 'react';
import clienteAxios from '../config/clienteAxios';

const NuevoPassword = () => {
  const [tokenValido, setTokenValido] = useState(false);
  const [alerta, setAlerta] = useState({});
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [passwordModificado, setPasswordModificado] = useState(false);

  const params = useParams();
  const {token} = params;

  useEffect(() => {
    const comprobarToken = async () => {
      try {
        await clienteAxios.get(`/usuarios/olvide-password/${token}`);
        setTokenValido(true);
      } catch (error) {
        setTokenValido(false);
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }
    comprobarToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(password !== password2) {
      setAlerta({
        msg: "Las contraseñas deben ser iguales.",
        error: true
      })
      return;
    }

    if(password === '' || password2 === '') {
      setAlerta({
        msg: "Todos los campos son obligatorios.",
        error: true
      })
      return;
    }

    setAlerta({});

    try {
      const {data} = await clienteAxios.post(`/usuarios/olvide-password/${token}`, {password});
      setAlerta({
        msg: data.msg,
        error: false
      });
      setPassword('');
      setPassword2('');
      setPasswordModificado(true);
    } catch (error) {
      setPasswordModificado(false);
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }

  }


  const {msg} = alerta;

  return (
    <>
      <h1 className='text-sky-600 font-black text-5xl md:text-6xl capitalize text-center'>Recupera tu acceso y no pierdas tus proyectos
        <span className='text-slate-700'> proyectos</span>
      </h1>
      {msg && <Alerta alerta={alerta}/>}
      {tokenValido && (
        <form 
        onSubmit={handleSubmit}
        className='my-5 bg-white shadow rounded p-5 md:p-10'
        >
        <div className='my-2 md:my-5'>
              <label
                htmlFor='password' 
                className='uppercase text-gray-600 block font-bold text-lg'
              
              >nueva contraseña</label>
              <input 
                id='password'
                type="password"
                placeholder="Contraseña de Registro" 
                className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className='my-2 md:my-5'>
              <label
                htmlFor='password2' 
                className='uppercase text-gray-600 block font-bold text-lg'
              
              >repetir contraseña</label>
              <input 
                id='password2'
                type="password"
                placeholder="Repetir Contraseña" 
                className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
                value={password2}
                onChange={e => setPassword2(e.target.value)}
              />
            </div>
            <input 
              type="submit"
              value="Actualizar Contraseña"
              className="w-full bg-sky-700 py-3 text-lg	text-white uppercase font-bold cursor-pointer hover:bg-sky-800 transition-colors rounded mb-5 mt-3 md:mt-0"
  
            />
        </form>
      ) }
      {passwordModificado && (
         <nav className='lg:flex justify-center mb-3'>
            <p className="text-slate-600 uppercase font-medium">AHORA PUEDES<Link to="/" className="font-bold text-sky-700 hover:underline"> Iniciar Sesión</Link> CORRECTAMENTE.</p>
         </nav>
      )}
      
    </>
  )
}

export default NuevoPassword