import { Space, Table, Tag, Button, ConfigProvider, Modal, Spin } from 'antd';
import { useEffect, useState } from "react";
import Http from "@/common/utils/classes/http";
import { userResponseDto } from '@/common/components/users/dto/user-response.dto';
import { ColumnsType } from 'antd/es/table';
import User from '@/common/components/users/add-edit-user';

const App = () => {
  const [users, setUsers] = useState<userResponseDto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [user, setUser] = useState<userResponseDto>();
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
  const showModalEdit = (userPass: any) => {
    setUser(userPass);
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

  const columns: ColumnsType<userResponseDto> = [
    {
      title: 'Nombre de Usuario',
      dataIndex: 'username',
        key: 'username',
    },
    {
      title: 'Administrador',
      dataIndex: 'isAdmin',
        key: 'isAdmin',
      render: (isAdmin: boolean) => (isAdmin? "Si": "No")
    },
    {
      title: "Editar",
      dataIndex: 'edit',
      key: 'edit',
      render: (_, user) => (
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#00b96b",
            },
          }}
        >
          <Button type="primary" onClick={()=>showModalEdit(user)}>Editar</Button>
        </ConfigProvider>
      ),
    },
    {
      title: 'Eliminar',
      dataIndex: 'delete',
        key: 'delete',
      render: (_, user) => (
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#ff0000",
            },
          }}
        >
          <Button type="primary" 
          onClick={() => handleDelete(user.id)}
          >Eliminar</Button>
        </ConfigProvider>
      ),
    },
  ];

  const handleDelete = (id: any) => {
    Http.Delete(`/Users/${id}`, eval('')).then(() => {
      reloadData();
    });
  };

  const reloadData = async() => {
    setLoading(true);
    await Http.Get<userResponseDto[]>("/Users").then((data) => {
      setUsers(data);
    });
    setLoading(false);
  };


  return (
    <div>
      <div className='title'>
        <h1 className='title-name' >Usuarios</h1>

        <Button className='add-button' onClick={showModal} type="primary">Agregar Nuevo</Button>
      </div>      
      <Modal
        title="Nuevo Usuario"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        key={trigger} 
        footer={[ ]}
      >
        <User handleOk={handleOk} />
      </Modal>
      <Modal
        title="Editar Usuario"
        open={isModalOpenEdit}
        onOk={handleOkEdit}
        onCancel={handleCancelEdit}
        key={trigger} 
        footer={[ ]}
      >
        <User handleOk={handleOkEdit} usuario={user} action='edit'/>
      </Modal>
      <Spin spinning={loading} tip="Cargando...">
        <Table columns={columns} dataSource={users} />
      </Spin>
    </div>
  )
};

export default App;