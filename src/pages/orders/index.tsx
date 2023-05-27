import { Space, Table, Tag, Button, Modal, Spin } from 'antd';
import { useEffect, useState } from "react";
import Http from "@/common/utils/classes/http";
import { OrderResponseDto } from '@/common/components/orders/dto/order-response.dto';
import { clientResponseDto } from '@/common/components/clients/dto/client-response.dto';
import { ProductResponseDto } from '@/common/components/products/dto/product-response.dto';
import { PriceResponseDto } from '@/common/components/orders/dto/price-response.dto';
import { ColumnsType } from 'antd/es/table';
import AddOrder from '@/common/components/orders/add-order';
import ProductsOrder from '@/common/components/orders/products-order';


export default function Orders() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenProducts, setIsModalOpenProducts] = useState(false);
    const [trigger, setTrigger] = useState(0);
    const [orders, setOrders] = useState<OrderResponseDto[]>([]);
    const [clients, setClients] = useState<clientResponseDto[]>([]);
    const [prices, setPrices] = useState<PriceResponseDto[]>([]);
    const [productList, setProductList] = useState<ProductResponseDto[]>([]); 
    const [loading, setLoading] = useState(false);

    const columns: ColumnsType<OrderResponseDto> = [
        {
          title: 'Cliente',
          dataIndex: 'clientId',
          key: 'clientId',
          render: (value, row, index) => (
            <div>
              {getClientName(value)}
            </div>
          ),
        },
        {
          title: 'Precio',
          dataIndex: 'priceId',
          key: 'priceId',
          render: (value, row, index) => (
            <div>
              {getPriceName(value)}
            </div>
          ),
        },
        {
          title: 'Fecha de creación',
          dataIndex: 'createdAt',
          key: 'createdAt',
          render: (value, row, index) => (
            <div>
              {value.split('T')[0]}
            </div>
          ),
        },
        {
          title: 'Fecha de entrega',
          dataIndex: 'deliveredAt',
          key: 'deliveredAt',
          render: (value, row, index) => (
            <div>
              {value ? value.split('T')[0] : ''}
            </div>
          ),
        },
        {
          title: 'Productos',
          key: 'products',
          render: (value, row, index) => (
            <Space size="middle">
              <Button onClick={() => showModalProducts(value.products)} className='add-button' type='primary'>Ver</Button>
            </Space>
          ),
        },
        {
          title: 'Eliminar',
          key: 'delete',
          render: (value, row, index) => (
            <Space size="middle">
              <Button onClick={() => deleteOrder(row.id ?? '')} className='delete-button' type='primary' danger>Eliminar</Button>
            </Space>
          ),
        },
      ];

    //-----------    Funciones   -----------//

    const showModal = () => {
      setIsModalOpen(true);
      setTrigger(trigger + 1);
    };
  
    const handleOk = () => {
      reloadData();
      setIsModalOpen(false);
    };
    
    const handleCancel = () => {
      setIsModalOpen(false);
    };

    const showModalProducts = (productListPass: ProductResponseDto[]) => {
      setProductList(productListPass)
      setIsModalOpenProducts(true);
      setTrigger(trigger + 1);
    };

    const handleOkProducts = () => {
      reloadData();
      setIsModalOpenProducts(false);
    };

    const handleCancelProducts = () => {
      setIsModalOpenProducts(false);
    };


    useEffect(() => {
        reloadData();
    }, []);

    const reloadData = async () => {
      setLoading(true);
      await Http.Get<OrderResponseDto[]>('/orders').then((data) => {
        setOrders(data);
      });
      await Http.Get<clientResponseDto[]>('/clients').then((data) => {  
        setClients(data);
      });
      await Http.Get<PriceResponseDto[]>('/prices').then((data) => {
        setPrices(data);
      });
      setLoading(false);
    };

    const getClientName = (id: string) => {
      const customer = clients.find((c) => c.id === id);
      var name = "";
      customer? name = customer.name : name = "No encontrado";
      return name;
    };

    const getPriceName = (id: string) => {
      const price = prices.find((c) => c.id === id);
      var name = "";
      price? name = price.name : name = "No encontrado";
      return name;
    };

    const deleteOrder = async (id: string) => {
      await Http.Delete('/orders/' + id, {}).then((data) => {
        reloadData();
      });
    };

    return (
        <div>
            <div className="title" key="title"> 
                <h1 className='title-name'>Ordenes</h1>
                <Button onClick={showModal} className='add-button' type='primary'>Nueva Orden</Button>
            </div>
            <div key="content">
              {/* Modal to add a new order */}
                <Modal
                open={isModalOpen}
                title="Nueva Orden"
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[ ]}
                key={trigger}
                >   
                    <AddOrder handleOk={handleOk} />
                </Modal>
              {/* Modal to see the products of an order */}
                <Modal
                  open={isModalOpenProducts}
                  title="Productos"
                  onOk={handleOkProducts}
                  onCancel={handleCancelProducts}
                  footer={[ ]}
                  key={"Product" + trigger}
                >
                  <ProductsOrder productList={productList} />
                </Modal>
                <Spin spinning={loading} >
                  <Table columns={columns} dataSource={orders} rowKey={'id'}/>
                </Spin>
            </div>
        </div>


    );
}