import { useState } from 'react';
import { Link } from 'react-router-dom';
import Alerta from '../components/Alerta';
import clienteAxios from '../config/clienteAxios';

const Registrar = () => {

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repetirPassword, setRepetirPassword] = useState('');
  const [alerta, setAlerta] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    if([nombre, email, password, repetirPassword].includes('')) {
      setAlerta({
        msg: "Todos los campos son obligatorios.",
        error: true
      })
      return;
    }

    if(password !== repetirPassword) {
      setAlerta({
        msg: "Las contraseñas no son iguales.",
        error: true
      })
      return;
    }

    if(password.length <= 6 ) {
      setAlerta({
        msg: "La contraseña debe tener mínimo 6 caracteres.",
        error: true
      })
    }


    setAlerta({});

    //Creamos el usuario en la base de datos.
    try {
      const {data} = await clienteAxios.post('/usuarios',
      {nombre, email, password});
      setAlerta({
        msg: data.msg,
        error: false
      })

      setNombre('');
      setPassword('');
      setEmail('');
      setRepetirPassword('')
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  return (
    <>
      <h1 className='text-sky-600 font-black text-5xl md:text-6xl capitalize text-center'>Crea tu cuenta y administra tus
        <span className='text-slate-700'> proyectos</span>
      </h1>
      {alerta.msg && <Alerta alerta={alerta}/>}
      
      <form 
      className='my-5 bg-white shadow rounded p-5 md:p-10'
      onSubmit={handleSubmit}
      >
          <div className='my-2 md:my-5'>
            <label
              htmlFor='nombre' 
              className='uppercase text-gray-600 block font-bold text-lg'
            
            >Nombre</label>
            <input 
              id='nombre'
              type="text"
              placeholder="Tu nombre" 
              className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
              value={nombre}
              onChange={e => setNombre(e.target.value)}
            />
          </div>
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
          <div className='my-2 md:my-5'>
            <label
              htmlFor='password' 
              className='uppercase text-gray-600 block font-bold text-lg'
            
            >contraseña</label>
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
            
            >confirmar contraseña</label>
            <input 
              id='password2'
              type="password"
              placeholder="Repetir Contraseña" 
              className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
              value={repetirPassword}
              onChange={e => setRepetirPassword(e.target.value)}
            />
          </div>
          <input 
            type="submit"
            value="Registrarse"
            className="w-full bg-sky-700 py-3 text-lg	text-white uppercase font-bold cursor-pointer hover:bg-sky-800 transition-colors rounded mb-5 mt-3 md:mt-0"
          />
      </form>
      <nav className='lg:flex lg:justify-between mb-3'>
          <p className="text-slate-600 uppercase font-medium">Ya tienes una cuenta? <Link to="/" className="font-bold text-sky-700 hover:underline">Inicia Sesión</Link>.</p>
      </nav>
    </>
  )
}

export default Registrar