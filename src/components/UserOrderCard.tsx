import { Order } from "../lib/types";

interface UserOrderCardProps {
  order: Order;
}

function UserOrderCard({ order }: UserOrderCardProps) {
  return <div>{order.id}</div>;
}

export default UserOrderCard;
