import AddEditProduct from "@/common/components/products/add-edit-product";
import { ProductResponseDto } from "@/common/components/products/dto/product-response.dto";
import Http from "@/common/utils/classes/http";
import { ENDPOINTS } from "@/common/utils/constants/endpoints.constant";
import { Button, ConfigProvider, Table, notification } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";

export default function Products() {
  const [products, setProducts] = useState<ProductResponseDto[]>([]);
  const [api, contextHolder] = notification.useNotification();

  const columns: ColumnsType<ProductResponseDto> = [
    {
      title: "Código",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Peso",
      dataIndex: "weight",
      key: "weight",
    },
    {
      title: "Largo",
      dataIndex: "length",
      key: "length",
    },
    {
      title: "Ancho",
      dataIndex: "width",
      key: "width",
    },
    {
      title: "Alto",
      dataIndex: "height",
      key: "height",
    },
    {
      title: "Diámetro",
      dataIndex: "diameter",
      key: "diameter",
    },
    {
      title: "Editar",
      key: "edit",
      render: (_, product) => (
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#00b96b",
            },
          }}
        >
          <AddEditProduct getProducts={getProducts} edit={product.id} />
        </ConfigProvider>
      ),
    },
    {
      title: "Eliminar",
      key: "delete",
      render: (_, product) => (
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#ff0000",
            },
          }}
        >
          <Button type="primary" onClick={() => deleteProduct(product.id)}>
            Eliminar
          </Button>
        </ConfigProvider>
      ),
    },
  ];

  const getProducts = () => {
    Http.Get<ProductResponseDto[]>(ENDPOINTS.PRODUCTS.BASE)
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        api["error"]({
          message: "Ha ocurrido un error al obtener los productos",
        });
      });
  };

  const deleteProduct = (id: string) => {
    Http.Delete<boolean>(ENDPOINTS.PRODUCTS.BY_ID(id), {})
      .then((data) => {
        getProducts();
      })
      .catch((error) => {
        api["error"]({
          message: "Ha ocurrido un error al eliminar el producto",
        });
      });
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div>
      <div className="title">
        <h1 className="title-name">Productos</h1>
        <AddEditProduct getProducts={getProducts} />
      </div>
      <Table dataSource={products} columns={columns} rowKey="id"></Table>
    </div>
  );
}
