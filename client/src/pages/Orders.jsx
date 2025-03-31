import React, { useEffect, useState } from 'react';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/axios';
import SummaryApi from '../config/SummaryApi';

const Orders = () => {
  const [orders, setOrders] = useState([]); // State to store orders

  // Fetch user orders
  const handleUserOrder = async () => {
    try {
      const response = await Axios(SummaryApi.UserOrder);
      setOrders(response.data.data); // Store orders in state
    } catch (error) {
      AxiosToastError(error);
    }
  };

  // Fetch orders when component mounts
  useEffect(() => {
    handleUserOrder();
  }, []);

  return (
    <section className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded-lg shadow">
              <h3 className="text-lg font-bold">Order ID: {order.orderId}</h3>
              <p>Total Amount: Rs. {order.totalAmt}</p>
              <p>Order Status: {order.payment_status}</p>
              <p>Delivery Address: {order.delivery_address.city} - {order.delivery_address.address_line}</p>
              <p>Ordered on: {new Date(order.createdAt).toLocaleString()}</p>
              <div className="mt-2">
                <strong>Products:</strong>
                <ul className="list-disc pl-5">
                  {order.product_details.map((product) => (
                    <li key={product.productId}>
                      {product.name} - {product.quantity} {product.unit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Orders;
