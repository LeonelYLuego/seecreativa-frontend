import { Space, Table, Tag, Button, ConfigProvider, Modal, Spin } from 'antd';
import { useEffect, useState } from "react";
import Http from "@/common/utils/classes/http";
import { clientResponseDto } from '@/common/components/clients/dto/client-response.dto';
import { ColumnsType } from 'antd/es/table';
import Cliente from '@/common/components/clients/add-edit-client';

const App = () => {
  const [clientes, setClientes] = useState<clientResponseDto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [client, setClient] = useState<clientResponseDto>();
  const [trigger, setTrigger] = useState(0);
  const [loading, setLoading] = useState(true);
  //state para un cliente en especifico

  const showModal = () => {
    setIsModalOpen(true);
    setTrigger(trigger + 1);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    reloadData();
  };
  
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showModalEdit = (clientePass: any) => {
    setClient(clientePass);
    setTrigger(trigger + 1);
    setIsModalOpenEdit(true);
  };

  const handleOkEdit = () => {
    setIsModalOpenEdit(false);
    reloadData();
  };
  
  const handleCancelEdit = () => {
    setIsModalOpenEdit(false);
  };

  useEffect(() => {
    reloadData();
  }, []);

  const columns: ColumnsType<clientResponseDto> = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Rfc',
      dataIndex: 'rfc',
      key: 'rfc',
    },
    {
      title: 'Dirección',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Correo',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Teléfono',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: "Editar",
      key: "edit",
      render: (_, client) => (
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#00b96b",
            },
          }}
        >
          <Button type="primary" onClick={()=>showModalEdit(client)}>Editar</Button>
        </ConfigProvider>
      ),
    },
    {
      title: 'Eliminar',
      dataIndex: 'delete',
      key: 'delete',
      render: (_, client) => (
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#ff0000",
            },
          }}
        >
          <Button type="primary" 
          onClick={() => handleDelete(client.id)}
          >Eliminar</Button>
        </ConfigProvider>
      ),
    },
  ];

  const handleDelete = (id: any) => {
    Http.Delete(`/clients/${id}`, eval('')).then(() => {
      reloadData();
    });
  };

  const reloadData = async() => {
    setLoading(true);
    await Http.Get<clientResponseDto[]>("/clients").then((data) => {
      setClientes(data);
    });
    setLoading(false);
  };


  return (
    <div>
      <div className='title'>
        <h1 className='title-name' >Clientes</h1>

        <Button className='add-button' onClick={showModal} type="primary">Agregar Nuevo</Button>
      </div>      
      <Modal
        title="Nuevo Cliente"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        key={trigger} 
        footer={[ ]}
      >
        <Cliente handleOk={handleOk} />
      </Modal>
      <Modal
        title="Editar Cliente"
        open={isModalOpenEdit}
        onOk={handleOkEdit}
        onCancel={handleCancelEdit}
        key={trigger} 
        footer={[ ]}
      >
        <Cliente handleOk={handleOkEdit} client={client} action='edit'/>
      </Modal>
      <Spin spinning={loading} tip="Cargando...">
        <Table columns={columns} dataSource={clientes} />
      </Spin>
    </div>
  )
};

export default App;