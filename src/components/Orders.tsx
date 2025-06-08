import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { ADMIN } from "../lib/constants";
import { useEffect, useState } from "react";
import orderService from "../lib/order.service";
import { loadAllOrders, loadUsersOrders } from "../store/orders";
import UserOrderCard from "./UserOrderCard";
import AdminViewOrderCard from "./AdminViewOrderCard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

function Orders() {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === ADMIN;

  const usersOrders = useSelector(
    (state: RootState) => state.orders.usersOrders
  );
  const allOrders = useSelector((state: RootState) => state.orders.allOrders);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [firstUsersPageOrderIndex, setFirstUsersPageOrderIndex] =
    useState<number>(0);
  const [firstAdminPageOrderIndex, setFirstAdminPageOrderIndex] =
    useState<number>(0);

  const [cardsPerPage, setCardsPerPage] = useState<number>(3);

  useEffect(() => {
    function handleMobile() {
      setCardsPerPage(window.innerWidth < 780 ? 1 : 3);
    }
    handleMobile();
    window.addEventListener("resize", handleMobile);
    return () => window.removeEventListener("resize", handleMobile);
  }, []);

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

  const userOrdersPage = usersOrders?.slice(
    firstUsersPageOrderIndex * cardsPerPage,
    firstUsersPageOrderIndex * cardsPerPage + cardsPerPage
  );
  const userTotalPages = Math.ceil((usersOrders?.length || 0) / cardsPerPage);

  const adminOrdersPage = allOrders?.slice(
    firstAdminPageOrderIndex * cardsPerPage,
    firstAdminPageOrderIndex * cardsPerPage + cardsPerPage
  );
  const adminTotalPages = Math.ceil((allOrders?.length || 0) / cardsPerPage);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-center font-extrabold text-3xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center gap-10 flex-col max-md:mt-20">
      <div className="p-10 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4 text-ceter">Your Orders</h2>
        <div className="flex items-center w-full">
          {usersOrders?.length && usersOrders.length > 0 ? (
            <>
              <button
                className="p-2 text-2xl text-primary disabled:opacity-30 cursor-pointer"
                onClick={() =>
                  setFirstUsersPageOrderIndex((p) => Math.max(0, p - 1))
                }
                disabled={firstUsersPageOrderIndex === 0}
                aria-label="Previous"
              >
                <FaArrowLeft />
              </button>
              <div className="flex max-md:overflow-x-auto max-md:scrollbar-thin max-md:w-full justify-center items-center gap-2 w-full">
                {userOrdersPage?.map((o) => (
                  <UserOrderCard key={o.id} order={o} />
                ))}
              </div>
              <button
                className="p-2 text-2xl text-primary disabled:opacity-30 cursor-pointer"
                onClick={() =>
                  setFirstUsersPageOrderIndex((p) =>
                    Math.min(userTotalPages - 1, p + 1)
                  )
                }
                disabled={firstUsersPageOrderIndex >= userTotalPages - 1}
                aria-label="Next"
              >
                <FaArrowRight />
              </button>
            </>
          ) : (
            "No orders found."
          )}
        </div>
        {userTotalPages > 1 && (
          <div className="mt-2 text-sm text-gray-500">
            Page {firstUsersPageOrderIndex + 1}/{userTotalPages}
          </div>
        )}
      </div>
      {isAdmin && (
        <div className="p-10 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4 text-ceter">All Orders</h2>
          <div className="flex items-center w-full">
            <button
              className="p-2 text-2xl text-primary disabled:opacity-30 cursor-pointer"
              onClick={() =>
                setFirstAdminPageOrderIndex((p) => Math.max(0, p - 1))
              }
              disabled={firstAdminPageOrderIndex === 0}
              aria-label="Previous"
            >
              <FaArrowLeft />
            </button>
            <div className="flex max-md:overflow-x-auto max-md:scrollbar-thin max-md:w-full justify-center items-center gap-2 w-full">
              {adminOrdersPage?.map((o) => (
                <AdminViewOrderCard key={o.id} order={o} />
              ))}
            </div>
            <button
              className="p-2 text-2xl text-primary disabled:opacity-30 cursor-pointer"
              onClick={() =>
                setFirstAdminPageOrderIndex((p) =>
                  Math.min(adminTotalPages - 1, p + 1)
                )
              }
              disabled={firstAdminPageOrderIndex >= adminTotalPages - 1}
              aria-label="Next"
            >
              <FaArrowRight />
            </button>
          </div>
          {adminTotalPages > 1 && (
            <div className="mt-2 text-sm text-gray-500">
              Page {firstAdminPageOrderIndex + 1}/{adminTotalPages}
            </div>
          )}
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
