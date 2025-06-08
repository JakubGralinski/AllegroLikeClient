import { useSelector } from "react-redux";
import { Order } from "../lib/types";
import { RootState } from "../store";

interface AdminViewOrderCardProps {
  order: Order;
}

function AdminViewOrderCard({ order }: AdminViewOrderCardProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <div
      className={`bg-white !text-black shadow-xl rounded-lg p-6 w-full max-w-lg mb-4 ${user?.id === order.user.id ? "border-2 border-blue-500" : ""}`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-lg">Order #{order.id}</span>
        <span className="text-xs text-gray-500">
          {new Date(order.placedAt).toLocaleString()}
        </span>
      </div>
      <div className="mb-2">
        <span className="text-sm text-gray-700">Status: </span>
        <span className="font-semibold">{order.status}</span>
      </div>
      <div className="mb-2">
        <span className="font-semibold text-sm">User:</span>
        <span className="ml-2 text-sm">
          {order.user.username} (
          <span className="text-gray-500">{order.user.email}</span>)
        </span>
      </div>
      <div className="border-t border-gray-100 my-2" />
      <div className="mb-2">
        <span className="font-semibold text-sm">Items:</span>
        <ul className="list-disc list-inside text-sm mt-1">
          {order.items.map((item, idx) => (
            <li key={idx}>
              {item.product.name}{" "}
              <span className="text-gray-500">x{item.quantity}</span>{" "}
              <span className="text-gray-400">
                (${item.product.price} each)
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-gray-100 my-2" />
      <div className="flex justify-between items-center">
        <span className="font-semibold">Total:</span>
        <span className="text-primary font-bold">${order.totalPrice}</span>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Shipping to: {order.shippingAddress.street}{" "}
        {order.shippingAddress.houseNumber}, {order.shippingAddress.city},{" "}
        {order.shippingAddress.country}
      </div>
    </div>
  );
}

export default AdminViewOrderCard;
