"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/auth/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"; // Shadcn Checkbox
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"; // Shadcn Input
import { Label } from "@/components/ui/label"; // Shadcn Label
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  address?: {
    id: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: {
    product: { name: string; price: number };
    quantity: number;
  }[];
}

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export default function OrdersPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
    isDefault: false,
  });

  useEffect(() => {
    if (!session) {
      router.push("/auth/sign-in");
      return;
    }
    const fetchData = async () => {
      const [ordersRes, addressesRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/addresses"),
      ]);
      setOrders(await ordersRes.json());
      setAddresses(await addressesRes.json());
      setLoading(false);
    };
    fetchData();
  }, [session]);

  const updateAddress = async (orderId: string, addressId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        body: JSON.stringify({ addressId }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders((prev) =>
          prev.map((order) => (order.id === orderId ? updatedOrder : order)),
        );
        toast.success("Address Updated", {
          description: "Order address has been bound.",
        });
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      toast.error("Error", {
        description: "Could not update address.",
      });
    }
  };

  const addAddress = async () => {
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        body: JSON.stringify(newAddress),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const address = await res.json();
        setAddresses((prev) => [...prev, address]);
        setNewAddress({
          street: "",
          city: "",
          state: "",
          zip: "",
          country: "US",
          isDefault: false,
        });
        setDialogOpen(false);
        toast.success("Address Added", {
          description: "New address has been added.",
        });
      } else {
        throw new Error("Failed to add address");
      }
    } catch (error) {
      toast.error("Error", {
        description: "Could not add address.",
      });
    }
  };

  if (!session) return <div>Redirecting to login...</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  Order #{order.id.slice(-8)}
                  <Badge
                    variant={
                      order.status === "pending" ? "secondary" : "default"
                    }
                  >
                    {order.status}
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Placed on {new Date(order.createdAt).toLocaleDateString()} |
                  Total: ${order.total}
                </p>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h3 className="font-semibold">Items:</h3>
                  <ul className="list-disc list-inside">
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.product.name} x {item.quantity} - $
                        {item.product.price * item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-4">
                  <h3 className="font-semibold">Shipping Address:</h3>
                  {order.address ? (
                    <p>
                      {order.address.street}, {order.address.city},{" "}
                      {order.address.state} {order.address.zip},{" "}
                      {order.address.country}
                    </p>
                  ) : (
                    <p className="text-muted-foreground">No address bound.</p>
                  )}
                </div>
                {order.status === "pending" && (
                  <div>
                    <Select
                      onValueChange={(value) => updateAddress(order.id, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an address to bind" />
                      </SelectTrigger>
                      <SelectContent>
                        {addresses.map((addr) => (
                          <SelectItem key={addr.id} value={addr.id}>
                            {addr.street}, {addr.city}, {addr.state} {addr.zip}
                          </SelectItem>
                        ))}
                        <SelectItem value="add-new">
                          <Dialog
                            open={dialogOpen}
                            onOpenChange={setDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                className="w-full justify-start"
                              >
                                + Add New Address
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Add New Address</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="street">Street</Label>
                                  <Input
                                    id="street"
                                    value={newAddress.street}
                                    onChange={(e) =>
                                      setNewAddress({
                                        ...newAddress,
                                        street: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="city">City</Label>
                                  <Input
                                    id="city"
                                    value={newAddress.city}
                                    onChange={(e) =>
                                      setNewAddress({
                                        ...newAddress,
                                        city: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="state">State</Label>
                                  <Input
                                    id="state"
                                    value={newAddress.state}
                                    onChange={(e) =>
                                      setNewAddress({
                                        ...newAddress,
                                        state: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="zip">ZIP</Label>
                                  <Input
                                    id="zip"
                                    value={newAddress.zip}
                                    onChange={(e) =>
                                      setNewAddress({
                                        ...newAddress,
                                        zip: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="country">Country</Label>
                                  <Input
                                    id="country"
                                    value={newAddress.country}
                                    onChange={(e) =>
                                      setNewAddress({
                                        ...newAddress,
                                        country: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="isDefault"
                                    checked={newAddress.isDefault}
                                    onCheckedChange={(checked) =>
                                      setNewAddress({
                                        ...newAddress,
                                        isDefault: !!checked,
                                      })
                                    }
                                  />
                                  <Label htmlFor="isDefault">
                                    Set as default
                                  </Label>
                                </div>
                                <Button onClick={addAddress} className="w-full">
                                  Add Address
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
