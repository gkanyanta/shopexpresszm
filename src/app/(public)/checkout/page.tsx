"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/hooks/use-cart";
import { createOrder, applyCoupon, getDeliveryFee } from "@/actions/checkout";
import { getAddresses, createAddress } from "@/actions/addresses";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Truck,
  Tag,
  CreditCard,
  ClipboardList,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Plus,
  Check,
  X,
} from "lucide-react";
import type { DeliveryMethod, PaymentMethod } from "@prisma/client";

interface Address {
  id: string;
  label: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  address1: string;
  address2: string | null;
  city: string;
  province: string;
  isDefault: boolean;
}

const STEPS = [
  { id: 1, label: "Address", icon: MapPin },
  { id: 2, label: "Delivery", icon: Truck },
  { id: 3, label: "Coupon", icon: Tag },
  { id: 4, label: "Payment", icon: CreditCard },
  { id: 5, label: "Review", icon: ClipboardList },
] as const;

const DELIVERY_METHODS: { value: DeliveryMethod; label: string; description: string }[] = [
  { value: "STANDARD", label: "Standard Delivery", description: "3-5 business days" },
  { value: "EXPRESS", label: "Express Delivery", description: "1-2 business days" },
  { value: "PICKUP", label: "Pickup", description: "Collect from our Lusaka warehouse" },
  { value: "NATIONWIDE_COURIER", label: "Nationwide Courier", description: "Delivery across Zambia" },
];

const PAYMENT_METHODS: { value: PaymentMethod; label: string; description: string }[] = [
  { value: "CARD", label: "Card Payment", description: "Visa, Mastercard" },
  { value: "MOBILE_MONEY", label: "Mobile Money", description: "MTN, Airtel Money" },
  { value: "BANK_TRANSFER", label: "Bank Transfer", description: "Direct bank transfer" },
];

const PROVINCES = [
  "Lusaka", "Copperbelt", "Central", "Eastern", "Luapula",
  "Muchinga", "Northern", "North-Western", "Southern", "Western",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const cart = useCart();
  const [isPending, startTransition] = useTransition();

  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    label: "",
  });

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("STANDARD");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [deliveryZone, setDeliveryZone] = useState("");

  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponInfo, setCouponInfo] = useState("");
  const [couponError, setCouponError] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("MOBILE_MONEY");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/checkout");
    }
  }, [status, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (status === "authenticated" && cart.items.length === 0) {
      router.push("/cart");
    }
  }, [status, cart.items.length, router]);

  // Load addresses
  useEffect(() => {
    if (status === "authenticated") {
      loadAddresses();
    }
  }, [status]);

  async function loadAddresses() {
    const result = await getAddresses();
    if (result.addresses) {
      setAddresses(result.addresses as Address[]);
      const defaultAddr = result.addresses.find((a) => a.isDefault);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      }
    }
  }

  // Calculate delivery fee when address or method changes
  useEffect(() => {
    if (selectedAddressId && deliveryMethod) {
      startTransition(async () => {
        const result = await getDeliveryFee(selectedAddressId, deliveryMethod);
        setDeliveryFee(result.fee ?? 0);
        setDeliveryZone(result.zoneName ?? "");
      });
    }
  }, [selectedAddressId, deliveryMethod]);

  const subtotal = cart.total();
  const total = subtotal + deliveryFee - couponDiscount;

  async function handleApplyCoupon() {
    setCouponError("");
    if (!couponCode.trim()) return;

    startTransition(async () => {
      const result = await applyCoupon(couponCode.trim(), subtotal);
      if (result.error) {
        setCouponError(result.error);
        setCouponApplied(false);
        setCouponDiscount(0);
      } else {
        setCouponApplied(true);
        setCouponDiscount(result.discount ?? 0);
        setCouponInfo(result.description || `${result.discountType === "percentage" ? `${result.discountValue}% off` : `K${result.discountValue} off`}`);
      }
    });
  }

  function removeCoupon() {
    setCouponCode("");
    setCouponApplied(false);
    setCouponDiscount(0);
    setCouponInfo("");
    setCouponError("");
  }

  async function handleAddAddress() {
    startTransition(async () => {
      const result = await createAddress(newAddress);
      if (result.error) {
        setError(result.error);
      } else if (result.address) {
        await loadAddresses();
        setSelectedAddressId(result.address.id);
        setShowNewAddress(false);
        setNewAddress({
          firstName: "",
          lastName: "",
          phone: "",
          address1: "",
          address2: "",
          city: "",
          province: "",
          label: "",
        });
      }
    });
  }

  async function handlePlaceOrder() {
    setError("");

    if (!selectedAddressId) {
      setError("Please select a delivery address");
      return;
    }

    startTransition(async () => {
      const result = await createOrder({
        items: cart.items.map((item) => ({
          productId: item.productId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
        addressId: selectedAddressId,
        deliveryMethod,
        paymentMethod,
        couponCode: couponApplied ? couponCode : undefined,
        notes: notes || undefined,
      });

      if (result.error) {
        setError(result.error);
      } else if (result.orderId) {
        cart.clearCart();
        if (result.redirectUrl) {
          window.location.href = result.redirectUrl;
        } else {
          router.push(`/checkout/confirmation/${result.orderId}`);
        }
      }
    });
  }

  function canProceed(): boolean {
    switch (step) {
      case 1:
        return !!selectedAddressId;
      case 2:
        return !!deliveryMethod;
      case 3:
        return true; // Coupon is optional
      case 4:
        return !!paymentMethod;
      case 5:
        return true;
      default:
        return false;
    }
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (status === "unauthenticated" || cart.items.length === 0) {
    return null;
  }

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Checkout</h1>

      {/* Step Indicator */}
      <div className="mb-8 flex items-center justify-between">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <button
              onClick={() => s.id < step && setStep(s.id)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                s.id === step
                  ? "bg-primary text-primary-foreground"
                  : s.id < step
                    ? "bg-primary/10 text-primary cursor-pointer"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              <s.icon className="size-4" />
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <ChevronRight className="mx-1 size-4 text-muted-foreground sm:mx-2" />
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {error && (
            <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Step 1: Address */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Delivery Address</h2>

              {addresses.length > 0 && !showNewAddress && (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                        selectedAddressId === addr.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {addr.firstName} {addr.lastName}
                          </span>
                          {addr.label && <Badge variant="secondary">{addr.label}</Badge>}
                          {addr.isDefault && <Badge variant="outline">Default</Badge>}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {addr.address1}
                          {addr.address2 ? `, ${addr.address2}` : ""}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {addr.city}, {addr.province}
                        </p>
                        <p className="text-sm text-muted-foreground">{addr.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {showNewAddress ? (
                <div className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Add New Address</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowNewAddress(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={newAddress.firstName}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, firstName: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={newAddress.lastName}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, lastName: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        value={newAddress.phone}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, phone: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="label">Label (e.g. Home, Work)</Label>
                      <Input
                        id="label"
                        value={newAddress.label}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, label: e.target.value })
                        }
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="address1">Address Line 1 *</Label>
                      <Input
                        id="address1"
                        value={newAddress.address1}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, address1: e.target.value })
                        }
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="address2">Address Line 2</Label>
                      <Input
                        id="address2"
                        value={newAddress.address2}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, address2: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={newAddress.city}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, city: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="province">Province *</Label>
                      <Select
                        value={newAddress.province}
                        onValueChange={(val) =>
                          setNewAddress({ ...newAddress, province: val ?? "" })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROVINCES.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={handleAddAddress} disabled={isPending}>
                    {isPending ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : null}
                    Save Address
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setShowNewAddress(true)}
                  className="w-full"
                >
                  <Plus className="mr-2 size-4" />
                  Add New Address
                </Button>
              )}
            </div>
          )}

          {/* Step 2: Delivery Method */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Delivery Method</h2>
              <div className="space-y-3">
                {DELIVERY_METHODS.map((method) => (
                  <label
                    key={method.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                      deliveryMethod === method.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={method.value}
                      checked={deliveryMethod === method.value}
                      onChange={() => setDeliveryMethod(method.value)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <span className="font-medium">{method.label}</span>
                      <p className="text-sm text-muted-foreground">
                        {method.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
              {deliveryFee > 0 && (
                <p className="text-sm text-muted-foreground">
                  Delivery fee to {deliveryZone}: <strong>{formatPrice(deliveryFee)}</strong>
                </p>
              )}
              {deliveryMethod === "PICKUP" && (
                <p className="text-sm text-muted-foreground">
                  Free pickup from our warehouse at Gardenia Road, Avondale, Lusaka.
                </p>
              )}
            </div>
          )}

          {/* Step 3: Coupon */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Coupon Code (Optional)</h2>
              {couponApplied ? (
                <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
                  <div className="flex items-center gap-2">
                    <Check className="size-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-700 dark:text-green-400">
                        Coupon &quot;{couponCode.toUpperCase()}&quot; applied
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-500">
                        {couponInfo} &mdash; You save {formatPrice(couponDiscount)}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={removeCoupon}>
                    <X className="size-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponError("");
                      }}
                      className="flex-1"
                    />
                    <Button onClick={handleApplyCoupon} disabled={isPending || !couponCode.trim()}>
                      {isPending ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      ) : null}
                      Apply
                    </Button>
                  </div>
                  {couponError && (
                    <p className="text-sm text-destructive">{couponError}</p>
                  )}
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                You can skip this step if you don&apos;t have a coupon.
              </p>
            </div>
          )}

          {/* Step 4: Payment Method */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Payment Method</h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                      paymentMethod === method.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={() => setPaymentMethod(method.value)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <span className="font-medium">{method.label}</span>
                      <p className="text-sm text-muted-foreground">
                        {method.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Review Your Order</h2>

              {/* Items */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Items ({cart.itemCount()})</h3>
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-lg border p-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="size-16 rounded-md object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      {item.vendorName && (
                        <p className="text-xs text-muted-foreground">by {item.vendorName}</p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.price)} x {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Delivery Address */}
              {selectedAddress && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Delivery Address</h3>
                  <p className="mt-1">
                    {selectedAddress.firstName} {selectedAddress.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedAddress.address1}, {selectedAddress.city}, {selectedAddress.province}
                  </p>
                  <p className="text-sm text-muted-foreground">{selectedAddress.phone}</p>
                </div>
              )}

              {/* Delivery Method */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Delivery Method</h3>
                <p className="mt-1">
                  {DELIVERY_METHODS.find((m) => m.value === deliveryMethod)?.label}
                </p>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Payment Method</h3>
                <p className="mt-1">
                  {PAYMENT_METHODS.find((m) => m.value === paymentMethod)?.label}
                </p>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Order Notes (Optional)</Label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions for your order..."
                  className="mt-1 h-20 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                <ChevronLeft className="mr-1 size-4" />
                Back
              </Button>
            ) : (
              <div />
            )}
            {step < 5 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
              >
                Continue
                <ChevronRight className="ml-1 size-4" />
              </Button>
            ) : (
              <Button
                onClick={handlePlaceOrder}
                disabled={isPending}
                className="min-w-[160px]"
              >
                {isPending ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : null}
                Place Order &mdash; {formatPrice(total)}
              </Button>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-lg border bg-muted/30 p-4">
            <h3 className="font-semibold">Order Summary</h3>
            <Separator className="my-3" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Subtotal ({cart.itemCount()} items)
                </span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span>{deliveryFee > 0 ? formatPrice(deliveryFee) : "Free"}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
