import { Order } from "../lib/types";

interface AdminViewOrderCardProps {
  order: Order;
}

function AdminViewOrderCard({ order }: AdminViewOrderCardProps) {
  return <div>{order.id}</div>;
}

export default AdminViewOrderCard;
