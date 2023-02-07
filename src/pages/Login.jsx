import { Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Alerta from '../components/Alerta';
import clienteAxios from '../config/clienteAxios';
import useAuth from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alerta, setAlerta] = useState({});
  const navigate = useNavigate();
  const {setAuth, auth} = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if([email, password].includes('') ) {
      setAlerta({
        msg: "Todos los campos son obligatorios.",
        error: true
      })
      return;
    }

    setAlerta({});

    try {
      const {data} = await clienteAxios.post('/usuarios/login', {email, password});
      localStorage.setItem('token', data.token);
      setAuth(data);
      setAlerta({});
      navigate("/proyectos")
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }


  } 

  useEffect(() => {
    if(auth._id) {
      navigate("/proyectos")
      console.log("Hola")
      console.log(auth)
    }
  }, [auth, navigate])
 
  const {msg} = alerta;

  return (
    <>
      <h1 className='text-sky-600 font-black text-5xl md:text-6xl capitalize text-center'>Inicia sesión y administra tus 
        <span className='text-slate-700'> proyectos</span>
      </h1>
      {msg && <Alerta alerta={alerta}/>}
      <form 
        onSubmit={handleSubmit}
        className='my-5 bg-white shadow rounded p-5 md:p-10'
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
          <input 
            type="submit"
            value="Iniciar Sesión"
            className="w-full bg-sky-700 py-3 text-lg	text-white uppercase font-bold cursor-pointer hover:bg-sky-800 transition-colors rounded mb-5 mt-3 md:mt-0"

          />
      </form>

      <nav className='lg:flex lg:justify-between mb-3'>
          <p className="text-slate-600 uppercase font-medium">¿No tienes cuenta? <Link to="registrar" className="font-bold text-sky-700 hover:underline">Registrate</Link>.</p>
          <Link className="text-slate-600 uppercase font-medium hover:underline" to="olvide-password">Olvide mi contraseña</Link>
      </nav>
    </>
  )
}

export default Login