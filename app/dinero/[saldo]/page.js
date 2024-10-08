"use client"
import { cargarGastosPorId, obtenerSaldo, crearGasto } from '@/app/services/Apis/Saldos'
import { formatearDinero } from '@/app/services/Funciones/Formateadores'
import { Button, Chip, Input } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import GastoItem from '../Componentes/GastoItem'
import BackButton from '@/app/Componentes/Chat/BotonBack'

const Saldo = ({ params }) => {

    const [saldo, setSaldo] = useState({
        "Descripcion": "",
        "Dinero": 0
    })

    const [gastos, setGastos] = useState([])
    const [nuevoGasto, setNuevoGasto] = useState({
        "Descripcion": "",
        "Valor": 0,
        "Saldo": params.saldo
    })
    const [subtTotal, setSubTotal] = useState(0)

    useEffect(() => {
        cargarSaldo()
    }, [])

    useEffect(() => {
        if (saldo.Dinero !== 0) {
            calcularTotal(gastos)
        }
    }, [saldo, gastos])

    const cargarSaldo = async () => {
        const res = await obtenerSaldo(params.saldo)
        if (!res) {
            alert('Ocurrió un error al cargar el saldo')
            return
        }
        setSaldo(res[0])
        cargarGastos()
    }

    const cargarGastos = async () => {
        const res = await cargarGastosPorId(params.saldo)
        if (!res) {
            alert('Ocurrió un error al cargar los gastos')
            return
        }
        setGastos(res)
    }

    const calcularTotal = (gastos) => {
        let total = 0
        gastos.forEach(gasto => {
            total += gasto.Valor
        })

        setSubTotal(saldo.Dinero - total)
    }

    const handleNuevoGasto = (e) => {
        setNuevoGasto({
            ...nuevoGasto,
            [e.target.name]: e.target.value
        })
    }

    const handleSumbit = async (e) => {
        e.preventDefault()
        const res = await crearGasto(nuevoGasto)
        if (!res) {
            alert('Ocurrio un error al crear el gasto')
            return
        }
        limpiarYCargar()
    }

    const limpiarYCargar = () => {
        setNuevoGasto({
            "Descripcion": "",
            "Valor": 0,
            "Saldo": params.saldo
        })
        cargarGastos()
    }




    return (

        <main className="flex min-h-screen flex-col  relative items-center justify-start p-5 md:p-24 bg-smoke-900 gap-3 dark">
          
          <div className='w-full flex items-center justify-between gap-3'>
            {/* Boton back */}
            <BackButton />
            <h1>{saldo.Descripcion}</h1>
            </div>
            <Chip color='success' variant='flat' className='text-xl' auto>{formatearDinero(saldo.Dinero)}</Chip>

            {/* Seccion de gastos con scroll si hay muchos */}
            <section className="flex pb-40 flex-col gap-3 py-4 w-full md:w-[80%]  h-[50vh] overflow-y-scroll  ">
            {
                gastos.map(gasto => {
                    return (
                       <GastoItem key={gasto.id} gasto={gasto} limpiarYCargar={limpiarYCargar} />
                    )
                })
            }
            </section>

          

           
            {/* la seccion de EL subtotal fijo en la parte inferior */}
            <section className="flex flex-col gap-3  w-[90%]  md:w-[80%] absolute bottom-0 items-center justify-between py-2">
            <form
                onSubmit={handleSumbit}
                className="flex flex-col gap-3 items-center justify-center w-full">
                <Input 
                color='secondary'
                className='md:w-80'
                value={nuevoGasto.Descripcion} onChange={handleNuevoGasto} name="Descripcion" placeholder="Descripcion" />
                <Input
                className='md:w-80'
                color='success' variant='flat' startContent='$'
                value={nuevoGasto.Valor} onChange={handleNuevoGasto} name="Valor" placeholder="Dinero" />
                <div className='w-full flex items-center justify-between gap-3'>
                <Chip color='success' variant='flat' auto>{formatearDinero(nuevoGasto.Valor)}</Chip>
                <Button color='primary' auto type='submit' >Crear Gasto</Button></div>
            </form>
            <div className="bg-green-500 h-1 w-full rounded-xl mt-2"></div>
            <Chip color='success' variant='flat' className='text-xl' auto>{formatearDinero(subtTotal)}</Chip>
            </section>

        </main>




    )
}

export default Saldo