import AddEditProduct from "@/common/components/products/add-edit-product";
import { ProductResponseDto } from "@/common/components/products/dto/product-response.dto";
import Http from "@/common/utils/classes/http";
import { Button, ConfigProvider, Modal, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";

export default function Products() {
  const [products, setProducts] = useState<ProductResponseDto[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
          <Button type="primary">Editar</Button>
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
          <Button type="primary">Eliminar</Button>
        </ConfigProvider>
      ),
    },
  ];

  useEffect(() => {
    Http.Get<ProductResponseDto[]>("/Products").then((data) => {
      setProducts(data);
    });
  }, []);

  return (
    <div>
      <div className="title">
        <h1 className="title-name">Productos</h1>
        <Button type="primary" className="add-button" onClick={showModal}>
          Agregar Producto
        </Button>
      </div>
      <Modal
        title="Agregar Producto"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <AddEditProduct />
      </Modal>
      <Table dataSource={products} columns={columns} rowKey="id"></Table>
    </div>
  );
}
