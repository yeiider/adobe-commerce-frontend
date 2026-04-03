'use client'

import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useCart } from '@/src/hooks/use-cart'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { useDebouncedValue } from '@/src/hooks/use-debounced-value'

interface CartItemQuantityProps {
  cartItemUid: string
  quantity: number
  isReadOnly?: boolean
}

export function CartItemQuantity({ cartItemUid, quantity, isReadOnly = false }: CartItemQuantityProps) {
  const [localQuantity, setLocalQuantity] = useState(quantity)
  const debouncedQuantity = useDebouncedValue(localQuantity, 500)
  const [isUpdating, setIsUpdating] = useState(false)
  const { updateItems, removeItem } = useCart()

  useEffect(() => {
    setLocalQuantity(quantity)
  }, [quantity])

  useEffect(() => {
    if (debouncedQuantity === quantity) return

    const updateQuantity = async () => {
      setIsUpdating(true)
      const toastId = toast.loading('Actualizando cantidad...')
      try {
        const result = await updateItems([{ cart_item_uid: cartItemUid, quantity: debouncedQuantity }])
        if (result) {
          toast.success('Cantidad actualizada', { id: toastId })
        } else {
          toast.error('Ocurrió un error al actualizar la cantidad', { id: toastId })
          setLocalQuantity(quantity) // Revert
        }
      } catch (error) {
        toast.error('Ocurrió un error al actualizar', { id: toastId })
        setLocalQuantity(quantity) // Revert
      } finally {
        setIsUpdating(false)
      }
    }

    if (debouncedQuantity > 0) {
      updateQuantity()
    } else if (debouncedQuantity === 0) {
      handleRemove()
    }
  }, [debouncedQuantity, cartItemUid])

  const handleRemove = async () => {
    if (isUpdating) return
    setIsUpdating(true)
    const toastId = toast.loading('Eliminando producto...')
    try {
      const result = await removeItem(cartItemUid)
      if (result) {
        toast.success('Producto eliminado del carrito', { id: toastId })
      } else {
        toast.error('Error al intentar eliminar el producto', { id: toastId })
      }
    } catch {
      toast.error('Error al intentar eliminar el producto', { id: toastId })
    } finally {
      setIsUpdating(false)
    }
  }

  if (isReadOnly) {
    return <span className="text-sm font-medium">Cant: {quantity}</span>
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center border rounded-md">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-none border-r opacity-70 hover:opacity-100 disabled:opacity-30"
          onClick={() => setLocalQuantity(Math.max(0, localQuantity - 1))}
          disabled={isUpdating}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <Input
          type="number"
          className="h-8 w-12 rounded-none border-0 text-center font-medium focus-visible:ring-0 focus-visible:ring-offset-0 p-0 hide-arrows"
          value={localQuantity}
          onChange={(e) => {
            const val = parseInt(e.target.value)
            if (!isNaN(val) && val >= 0) {
              setLocalQuantity(val)
            } else if (e.target.value === '') {
              setLocalQuantity(0)
            }
          }}
          disabled={isUpdating}
          min={0}
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-none border-l opacity-70 hover:opacity-100 disabled:opacity-30"
          onClick={() => setLocalQuantity(localQuantity + 1)}
          disabled={isUpdating}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive opacity-70 hover:opacity-100 hover:text-destructive hover:bg-destructive/10"
        onClick={handleRemove}
        disabled={isUpdating}
        title="Eliminar producto"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
