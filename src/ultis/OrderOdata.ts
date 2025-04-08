//get all
//https://localhost:7050/odata/order

//post
//https://localhost:7050/odata/order

//get by id
//https://localhost:7050/odata/order/1

//put
//https://localhost:7050/odata/order/1

//delete
//https://localhost:7050/odata/order/1

//get
//https://localhost:7050/odata/order/seller/1

//get
//https://localhost:7050/odata/order/buyer/1

//get
//https://localhost:7050/odata/order/status/1


//không sử dụng https://localhost:7050/odata 

//sử dụng https://apivietnong-f9a8ecdydsdmebb3.canadacentral-01.azurewebsites.net/odata trong odata client

// orderApi.ts
import apiclient from './apiclient'; // Đảm bảo đường dẫn đúng đến file chứa apiclient
import { OrderRequest } from '@/type/order';
import odataClient from './odataclient';
const createOrderApi = async (orderData: OrderRequest) => {
  try {
    const response = await apiclient.post('/orderpayos', orderData);
    return response.data; // Trả về dữ liệu từ phản hồi API
  } catch (error) {
    console.error('Error creating order:', error);
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
};


export const getOrderApi = async (buyerId: number) => {
  try {
    const response = await odataClient.get(`/order/buyer/${buyerId}`);
    return response.data; // Trả về dữ liệu từ phản hồi API
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
};

export const getOrderDetailApi = async (orderId: number) => {
  try {
    const response = await odataClient.get(`/orderdetail/order/${orderId}`);
    return response.data; // Trả về dữ liệu từ phản hồi API
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
};

export default createOrderApi;