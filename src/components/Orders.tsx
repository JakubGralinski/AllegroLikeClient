import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { ADMIN } from "../lib/constants";
import { useEffect, useState } from "react";
import orderService from "../lib/order.service";
import { loadAllOrders, loadUsersOrders } from "../store/orders";
import UserOrderCard from "./UserOrderCard";
import AdminViewOrderCard from "./AdminViewOrderCard";

function Orders() {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === ADMIN;

  const usersOrders = useSelector(
    (state: RootState) => state.orders.usersOrders,
  );
  const allOrders = useSelector((state: RootState) => state.orders.allOrders);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserOrders(): Promise<void> {
      setIsLoading(true);

      try {
        const userOrdersRes = await orderService.getAllOrdersByUserId(user!.id);
        if (userOrdersRes.isSuccess) {
          dispatch(loadUsersOrders(userOrdersRes.content));
          setError(null);
        } else {
          setError(userOrdersRes.errMessage);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (!usersOrders) {
      fetchUserOrders();
    }
  }, [usersOrders, dispatch, user]);

  useEffect(() => {
    async function fetchAllOrders(): Promise<void> {
      setIsLoading(true);

      try {
        const allOrdersRes = await orderService.getAllOrders();
        if (allOrdersRes.isSuccess) {
          dispatch(loadAllOrders(allOrdersRes.content));
          setError(null);
        } else {
          setError(allOrdersRes.errMessage);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (isAdmin && !allOrders) {
      fetchAllOrders();
    }
  }, [allOrders, dispatch, isAdmin]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-center font-extrabold text-3xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center gap-10 flex-col max-md:mt-20">
      <div className="p-10 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4 text-ceter">Your Orders</h2>
        <div className="flex max-md:flex-col justify-center items-center gap-2">
          {usersOrders?.map((o) => <UserOrderCard order={o} />)}
        </div>
      </div>
      {isAdmin && (
        <div className="p-10 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4 text-ceter">Your Orders</h2>
          <div className="flex max-md:flex-col justify-center items-center gap-2">
            {allOrders?.map((o) => <AdminViewOrderCard order={o} />)}
          </div>
        </div>
      )}

      {error && (
        <div className="text-lg text-center font-semibold text-secondary mt-2">
          {error}
        </div>
      )}
    </div>
  );
}

export default Orders;
