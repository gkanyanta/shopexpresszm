"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/format";
import type { Metadata } from "next";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingCart className="h-16 w-16 text-zinc-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">
          Your cart is empty
        </h1>
        <p className="text-zinc-500 mb-6">
          Looks like you haven&apos;t added any products yet.
        </p>
        <Link href="/shop">
          <Button className="bg-zinc-900 hover:bg-zinc-800">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-zinc-900 mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        {/* Cart Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 bg-white rounded-xl border p-4"
            >
              <div className="w-20 h-20 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0">
                <ShoppingCart className="h-8 w-8 text-zinc-300" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-zinc-900 text-sm truncate">
                  {item.title}
                </h3>
                {item.vendorName && (
                  <p className="text-xs text-zinc-400">{item.vendorName}</p>
                )}
                <p className="font-semibold text-zinc-900 mt-1">
                  {formatPrice(item.price)}
                </p>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="p-1.5 hover:bg-zinc-50"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="p-1.5 hover:bg-zinc-50"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-red-500 hover:text-red-600"
          >
            Clear Cart
          </Button>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl border p-6 h-fit sticky top-24">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">
            Order Summary
          </h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Subtotal</span>
              <span className="font-medium">{formatPrice(total())}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Delivery</span>
              <span className="text-zinc-400">Calculated at checkout</span>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatPrice(total())}</span>
          </div>

          <Link href="/checkout" className="block mt-6">
            <Button className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-900 font-semibold">
              Proceed to Checkout
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <Link
            href="/shop"
            className="block text-center text-sm text-zinc-500 hover:text-zinc-700 mt-3"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
