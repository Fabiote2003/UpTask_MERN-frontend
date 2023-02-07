import { useEffect, useState } from "react"
import {useParams, Link} from 'react-router-dom'
import Alerta from "../components/Alerta";
import clienteAxios from "../config/clienteAxios";

const ConfirmarCuenta = () => {
  const [alerta, setAlerta] = useState({});
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false);

  const params = useParams();
  const {id} = params;


  useEffect(() => {
    const confirmarCuenta = async () => {
      try {
        const {data} = await clienteAxios.get(`/usuarios/confirmar/${id}`);
        setAlerta({
          msg: data.msg,
          error: false
        })
        setCuentaConfirmada(true)
      } catch (error) {
        console.log(error);
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
        setCuentaConfirmada(false);
      }
    }
    confirmarCuenta();
  }, [])

  const {msg} = alerta;

  return (
    <>
      <h1 className='text-sky-600 font-black text-5xl md:text-6xl capitalize text-center'>Confirma tu cuenta y comienza a crear tus
        <span className='text-slate-700'> proyectos</span>
      </h1>
      {msg && <Alerta alerta={alerta}/>}
      {cuentaConfirmada && (
         <p className= "uppercase font-medium text-center text-sky-900"><Link to="/" className="font-bold hover:underline">Inicia Sesión</Link>.</p>
      )}
    </>
  )
}

export default ConfirmarCuenta