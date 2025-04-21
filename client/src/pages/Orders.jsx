import React, { useEffect, useState } from 'react';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/axios';
import SummaryApi from '../config/SummaryApi';

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [transaction, setTransaction] = useState([])
  const [showMap, setShowMap] = useState({});

  const handleUserOrder = async () => {
    try {
      const response = await Axios(SummaryApi.UserOrder);
      setOrders(response.data.data);
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleUserTransaction = async () => {
    try {
      const response = await Axios(SummaryApi.getUserTransaction);
      setTransaction(response.data.data);
    } catch (error) {
      AxiosToastError(error);
    }
  }

  const toggleMap = (orderId) => {
    setShowMap((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };


  useEffect(() => {
    handleUserOrder();
    handleUserTransaction();
  }, []);

  return (
    <section className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4 overflow-auto max-h-[70vh]">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded-lg shadow">
              <h3 className="text-lg font-bold">Order ID: {order.orderId}</h3>
              <p>Total Amount: Rs. {order.totalAmt}</p>
              <p>Payment Method: <strong>{order.payment_status}</strong></p>
              <p>Delivery Address: {order.delivery_address.city} - {order.delivery_address.address_line}</p>
              <p>Ordered on: {new Date(order.createdAt).toLocaleString()}</p>
              <div className="mt-2">
                <strong>Products:</strong>
                <ul className="list-disc pl-5">
                  {order.product_details.map((product) => (
                    <li key={product.productId}>
                      {product.name} - Qty-{product.quantity} - {product.restaurant}
                    </li>
                  ))}
                </ul>
              </div>
              <p>Order Status: <strong>{order.orderStatus}</strong></p>

              {/* Show Rider Information if Order is Accepted */}
              {order.orderStatus !== "Pending" && order.orderStatus !== "Delivered" && order.rider && (
                <div className="mt-2 p-2 bg-blue-100 rounded">
                  <p className="font-semibold">Rider Information:</p>
                  <p>Name: {order.rider.name}</p>
                  <p>Mobile: {order.rider.mobile}</p>

                  {/* Track Order Button */}
                  <button
                    onClick={() => toggleMap(order._id)}
                    className="mt-2 px-4 py-1 bg-[#783232] text-white rounded hover:bg-red-800"
                  >
                    {showMap[order._id] ? "Hide Map" : "Track Order"}
                  </button>

                  {/* Rider live location map shown only if button clicked */}
                  {showMap[order._id] && order.rider.location && (
                    <div className="mt-2">
                      <p className="font-semibold">Live Location:</p>
                      <iframe
                        width="100%"
                        height="200"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={`https://maps.google.com/maps?q=${order.rider.location.latitude},${order.rider.location.longitude}&z=15&output=embed`}
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {transaction.length === 0 ? (
        <p></p>
      ) : (
        <div className="space-y-4 overflow-auto max-h-[70vh]">
          {transaction.map((transaction) => (
            <div key={transaction._id} className="border p-4 rounded-lg shadow">
              <h3 className="text-lg font-bold">Order ID: {transaction.product_id}</h3>
              <p>Total Amount: Rs. {transaction.amount}</p>
              <p>Payment Status: <strong>Esewa</strong></p>
              <p>Delivery Address: {transaction.delivery_address.city} - {transaction.delivery_address.address_line}</p>
              <p>Ordered on: {new Date(transaction.createdAt).toLocaleString()}</p>
              <div className="mt-2">
                <strong>Products:</strong>
                <ul className="list-disc pl-5">
                  {transaction.product_details.map((product) => (
                    <li key={product.productId}>
                      {product.name} - Qty {product.quantity} - {product.restaurant}
                    </li>
                  ))}
                </ul>
              </div>
              <p>Order Status: <strong>{transaction.orderStatus}</strong></p>
              {/* Show Rider Information if Order is Accepted */}
              {transaction.orderStatus !== "Pending" && transaction.orderStatus !== "Delivered" && transaction.rider && (
                <div className="mt-2 p-2 bg-blue-100 rounded">
                  <p className="font-semibold">Rider Information:</p>
                  <p>Name: {transaction.rider.name}</p>
                  <p>Mobile: {transaction.rider.mobile}</p>
                  {/* Track Order Button */}
                  <button
                    onClick={() => toggleMap(transaction._id)}
                    className="mt-2 px-4 py-1 bg-[#783232] text-white rounded hover:bg-red-800"
                  >
                    {showMap[transaction._id] ? "Hide Map" : "Track Order"}
                  </button>

                  {/* Rider live location map shown only if button clicked */}
                  {showMap[transaction._id] && transaction.rider.location && (
                    <div className="mt-2">
                      <p className="font-semibold">Live Location:</p>
                      <iframe
                        width="100%"
                        height="200"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={`https://maps.google.com/maps?q=${transaction.rider.location.latitude},${transaction.rider.location.longitude}&z=15&output=embed`}
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}

                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Orders;
