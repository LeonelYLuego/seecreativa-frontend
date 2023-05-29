import { Drawer, Select, InputNumber, Space, Table, Tag, Button, ConfigProvider, Modal, Spin, Form, notification } from 'antd';
import { useEffect, useState } from "react";
import Http from "@/common/utils/classes/http";
import { clientResponseDto } from '@/common/components/clients/dto/client-response.dto';
import { ProductOrderCreateDto } from '@/common/components/orders/dto/product-order-create.dto';
import { PriceResponseDto } from '@/common/components/orders/dto/price-response.dto';
import { ProductOrderPostDto } from '@/common/components/orders/dto/product-order-post.dto';
import { ColumnsType, TableProps } from 'antd/es/table';
import { AddOrderDto } from './dto/add-order.dto';

export default function AddOrder({handleOk}: any) {
    const [api, contextHolder] = notification.useNotification();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [clients, setClients] = useState<clientResponseDto[]>([]);
    const [clientId, setClientId] = useState<string>();
    const [prices, setPrices] = useState<PriceResponseDto[]>([]);
    const [priceId, setPriceId] = useState<string>();
    const [products, setProducts] = useState<ProductOrderCreateDto[]>([]);
    const [productsOrder, setProductsOrder] = useState<ProductOrderCreateDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [trigger, setTrigger] = useState(0);

    const columns: ColumnsType<ProductOrderCreateDto> = [
        {
          title: 'Nombre',
          dataIndex: 'name',
          key: 'name',
          sorter: (a, b) => a.name.localeCompare(b.name),
          sortDirections: ['ascend', 'descend', 'ascend'],
          defaultSortOrder: 'ascend',
        },
        {
          title: 'Cantidad',
          dataIndex: 'quantity',
          key: 'quantity',
          render: (_, product) => (
            <div>
              {/* Input to set the quantity */}
              
              <InputNumber
                min={1}
                defaultValue={product.quantity || 1}
                onChange={(value) => {
                  // set the quantity of the product and set it on productsOrder
                  products.find((p) => p.id === product.id)!.quantity = value!;
                  setProducts([...products] );
                }}
              />
            </div>
          ),
        },
        {
          title: 'Agregar',
          key: 'add',
          render: (value, row, index) => (
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#00b96b",
                },
              }}
            >
              {/* Button to log the quantity on console */}
              <Button onClick={addProduct(row)} type='primary'>
                Agregar
              </Button>
              
            </ConfigProvider>
          ),
        },
      ];
  
      const columnsDrawer: ColumnsType<ProductOrderCreateDto> = [
        {
          title: 'Nombre',
          dataIndex: 'name',
          key: 'name',
          sorter: (a, b) => a.name.localeCompare(b.name),
          sortDirections: ['ascend', 'descend', 'ascend'],
          defaultSortOrder: 'ascend',
        },
        {
          title: 'Cantidad',
          dataIndex: 'quantity',
          key: 'quantity',
          render: ( value, row ) => (
            <div>
              {/* Input to set the quantity */}
              
              <InputNumber
                min={1}
                defaultValue={value || 1}
                onChange={(value) => {
                  // set the quantity of the product and set it on productsOrder
                  productsOrder.find((p) => p.id === row.id)!.quantity = value!;
                  setProductsOrder([...productsOrder] );
                }}
              />
            </div>
          ),
        },
        {
          title: 'Eliminar',
          key: 'deleteProduct',
          render: (value, row, index) => (
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#00b96b",
                },
              }}
            >
              {/* Button to log thequantity on console */}
              <Button onClick={deleteProduct(index)} type='primary'>
                Eliminar
              </Button>
            </ConfigProvider>
          ),
        },
      ];

      
      const openDrawer = () => {
        setIsDrawerOpen(true);
      };

      const closeDrawer = () => {
        setIsDrawerOpen(false);
        setTrigger(trigger + 1);
      };

      const openNotification = (title: string, description: string) => {
        api['error']({
          message: title,
          description: description,
        })
      }

      const reloadData = async () => {
        setLoading(true);
        await Http.Get<clientResponseDto[]>("/clients").then((data) => {
          setClients(data);
        });
        await Http.Get<ProductOrderCreateDto[]>("/products").then((data) => {
          setProducts(data);
        });
        await Http.Get<PriceResponseDto[]>("/prices").then((data) => {
          setPrices(data);
        });
        setLoading(false);
      }

      useEffect(() => {
        reloadData();
      }, []);

      
      const addProduct = (product: ProductOrderCreateDto) => {
        return () => {
          const existingProduct = productsOrder.find((p) => p.id === product.id);
          if (existingProduct) {
            existingProduct.quantity += product.quantity || 1 ;
          } else {
            const newProduct = { ...product, quantity: product.quantity || 1 };
            productsOrder.push(newProduct);
          }
          setProductsOrder([...productsOrder]);
        };
      };

      const deleteProduct = (index: number) => {
        return () => {
          // pop the product with the same id from the array
          productsOrder.splice(index, 1);
          setProductsOrder([...productsOrder]);
        };
      };

      const addOrder = async () => {
        var productsOk = false;
        var priceOk = false;
        var clientOk = false;

        if (productsOrder.length == 0) openNotification('Error', 'Debe agregar al menos un producto'); else productsOk = true;
        priceId ? priceOk = true : openNotification('Error', 'Debe seleccionar un precio');
        clientId ? clientOk = true : openNotification('Error', 'Debe seleccionar un cliente');

        if (productsOk && priceOk && clientOk) {
          setLoading(true);
          const productsOrderPost: ProductOrderPostDto[] = productsOrder.map(
            (product) => {
              return { productId: product.id, quantity: product.quantity };
            } );

          const order: AddOrderDto = {
            clientId: clientId ?? '',
            priceId: priceId ?? '',
            products: productsOrderPost,
          }

          await Http.Post("/orders", order).then((data) => {
            handleOk();
            closeDrawer();
          } ).catch((error) => {
            openNotification('Error', 'No se pudo agregar la orden');
            setLoading(false);
          } );
        }
      };


    return (
        <div>
          { contextHolder }
          <Spin spinning={loading} >
              <Form 
                fields={[
                  { name: "client" },
                  { name: "price" },
                ]}
              >
                <Form.Item name='client' rules={[{ required: true, message: "Introduce un nombre" }]}>
                  <Select
                    showSearch
                    className='client'
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    placeholder="Selecciona un cliente"
                    options={clients.map((client) => {
                      return { value: client.id, label: client.name };
                    })}
                    style={{ width: "100%" }}
                    onChange={(value) => {setClientId(value)}}
                    notFoundContent='No se encontraron clientes'
                  ></Select>
                </Form.Item> 

                <Form.Item required={true}>
                  <Select
                    placeholder="Selecciona un precio"
                    options={prices.map((price) => {
                      return { value: price.id, label: price.name };
                    })}
                    style={{ width: "100%" }}
                    onChange={(value) => {setPriceId(value)}}
                    notFoundContent='No se encontraron precios'
                    
                  ></Select>
                </Form.Item>

                <Table
                  pagination={{ pageSize: 4 }}
                  columns={columns}
                  dataSource={products}
                  rowKey='id'
                ></Table>
                <div style={{ textAlign: "center", marginBottom: "15px"}}>
                  <Button
                      onClick={openDrawer}
                      style={{ backgroundColor: "#83bcf2" }}
                      type='primary'
                  >
                    Productos de la orden
                  </Button>
                </div>
                
                <div style={{ textAlign: "center" }}>
                  <Form.Item>
                    <Button
                        onClick={addOrder}
                        type='primary'
                        htmlType='submit'
                    >
                      Crear orden
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            <Drawer
              title="Productos de la orden"
              onClose={closeDrawer}
              open={isDrawerOpen}
              key={trigger}
            >
              <Table
                columns={columnsDrawer}
                dataSource={productsOrder}
                rowKey='id'
              ></Table>
            </Drawer>
          </Spin>
        </div>
    );
};