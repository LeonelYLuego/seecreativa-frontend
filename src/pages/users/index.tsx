import { Input, Space, Table, Tag, Button, ConfigProvider, Modal, Spin } from 'antd';
import { useEffect, useState } from "react";
import Http from "@/common/utils/classes/http";
import { userResponseDto } from '@/common/components/users/dto/user-response.dto';
import { ColumnsType } from 'antd/es/table';
import User from '@/common/components/users/add-edit-user';

import { SearchOutlined } from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import type { InputRef } from 'antd';
import { useRef } from 'react';

type DataIndex = keyof userResponseDto;

const App = () => {
  const [users, setUsers] = useState<userResponseDto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [user, setUser] = useState<userResponseDto>();
  const [trigger, setTrigger] = useState(0);
  const [loading, setLoading] = useState(true);

    
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);


  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };  
  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<userResponseDto> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Buscar Nombre`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filtrar
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Cerrar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record['username']
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });


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
      ...getColumnSearchProps('username'),
    },
    {
      title: 'Administrador',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      render: (isAdmin: boolean) => (isAdmin? "Si": "No")
    },
    {
      title: 'Editar',
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
      <div key="title" className='title'>
        <h1 className='title-name' >Usuarios</h1>

        <Button className='add-button' onClick={showModal} type="primary">Agregar Nuevo</Button>
      </div>      
      <Modal
        title="Nuevo Usuario"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        key={`agregar-usuario-${trigger}`}
        footer={[ ]}
      >
        <User handleOk={handleOk} />
      </Modal>
      <Modal
        title="Editar Usuario"
        open={isModalOpenEdit}
        onOk={handleOkEdit}
        onCancel={handleCancelEdit}
        key={`editar-usuario-${trigger}`}
        footer={[ ]}
      >
        <User handleOk={handleOkEdit} usuario={user} action='edit'/>
      </Modal>
      <Spin spinning={loading} tip="Cargando...">
        <Table columns={columns} dataSource={users} rowKey="id" />
      </Spin>
    </div>
  )
};

export default App;