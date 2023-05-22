import { Input, Space, Table, Tag, Button, ConfigProvider, Modal, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import Http from "@/common/utils/classes/http";
import { clientResponseDto } from '@/common/components/clients/dto/client-response.dto';
import { ColumnsType } from 'antd/es/table';
import Cliente from '@/common/components/clients/add-edit-client';

import type { ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import type { InputRef } from 'antd';
import { useRef } from 'react';

// DataIndex is the name field of the dto
type DataIndex = keyof clientResponseDto;

const App = () => {
  const [clientes, setClientes] = useState<clientResponseDto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [client, setClient] = useState<clientResponseDto>();
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
  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<clientResponseDto> => ({
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
      record['name']
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
      ...getColumnSearchProps('name'),
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
      title: 'Editar',
      key: 'edit',
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
      <div key="title" className='title'>
        <h1 className='title-name' >Clientes</h1>

        <Button className='add-button' onClick={showModal} type="primary">Agregar Nuevo</Button>
      </div>      
      <Modal
        title="Nuevo Cliente"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        key={`create-${trigger}`} 
        footer={[ ]}
      >
        <Cliente handleOk={handleOk} />
      </Modal>
      <Modal
        title="Editar Cliente"
        open={isModalOpenEdit}
        onOk={handleOkEdit}
        onCancel={handleCancelEdit}
        key={`edit-${trigger}`} 
        footer={[ ]}
      >
        <Cliente handleOk={handleOkEdit} client={client} action='edit'/>
      </Modal>
      <Spin spinning={loading} tip="Cargando...">
        <Table columns={columns} dataSource={clientes} rowKey="id"/>
      </Spin>
    </div>
  )
};

export default App;