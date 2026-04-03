'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { toast } from 'sonner'
import { useCart } from '@/src/hooks/use-cart'
import { CartItemInput } from '@/src/types/cart.types'

interface CartQueueContextType {
  addToCartQueue: (items: CartItemInput[]) => Promise<void>;
  isAdding: boolean;
}

const CartQueueContext = createContext<CartQueueContextType | undefined>(undefined)

export function CartQueueProvider({ children }: { children: ReactNode }) {
  const { addItems } = useCart()
  const [pendingQueue, setPendingQueue] = useState<number>(0)
  
  const isAdding = pendingQueue > 0

  const addToCartQueue = async (items: CartItemInput[]) => {
    setPendingQueue(prev => prev + 1)
    const toastId = toast.loading('Agregando al carrito...')
    
    try {
      const result = await addItems(items)
      if (result) {
        toast.success(
          items.length > 1 
            ? `${items.length} productos añadidos al carrito` 
            : 'Producto añadido al carrito', 
          { id: toastId }
        )
      } else {
        toast.error('No se pudo añadir al carrito. Revisa la opción seleccionada.', { id: toastId })
      }
    } catch (error) {
      toast.error('Ocurrió un error inesperado al comunicar con el servidor.', { id: toastId })
      console.error('Cart Queue Error:', error)
    } finally {
      setPendingQueue(prev => Math.max(0, prev - 1))
    }
  }

  return (
    <CartQueueContext.Provider value={{ addToCartQueue, isAdding }}>
      {children}
    </CartQueueContext.Provider>
  )
}

export function useCartQueue() {
  const context = useContext(CartQueueContext)
  if (context === undefined) {
    throw new Error('useCartQueue must be used dentro de un CartQueueProvider')
  }
  return context
}
