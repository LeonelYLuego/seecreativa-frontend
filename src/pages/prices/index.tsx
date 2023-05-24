import React, { useState, useEffect } from 'react';
import { Space, Table, Tag, Button, Modal, Input } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import Http from "@/common/utils/classes/http";
import Precio from '@/common/components/prices/add-edit-prices';
import {priceResponseDto} from '@/common/components/prices/dto/price-response.dto';

interface DataType {
  key: string;
  name: string;
  minWeight: string;
  minPrice: string;
  factor: string;
}


const App = () => {
  const [isLoading2, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [pesoValue, setPesoValue] = useState<string>('');
  const [precioValue, setPrecioValue] = useState<string>('');
  const [factorValue, setFactorValue] = useState<string>('');
  const [precios, setPrecios] = useState<priceResponseDto[]>([]);
  const [precio, setPrecio] = useState<priceResponseDto>();
  const [trigger, setTrigger] = useState(0);

  const {confirm} = Modal;

  const showModal = () => {
    setOpen(true);
  };

  const showEdit = (precioPass: any) => {
    setPrecio(precioPass);
    setTrigger(trigger + 1);
    console.log(precioPass)
    setEdit(true);
  };

  const handleeditCancel = () => {
    setEdit(false);
  };

  const handleOkEdit = () => {
    setEdit(false);
    reloadData();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handlePesoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPesoValue(event.target.value);
  };

  const handlePrecioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrecioValue(event.target.value);
  };

  const handleFactorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFactorValue(event.target.value);
  };

  useEffect(() => {
    reloadData();
  }, []);

  const handleButtonClick = () => {
    //setIsLoading(true);

    const dataToSend = {
      name: inputValue,
      minWeight: pesoValue,
      minPrice: precioValue,
      factor: factorValue
    };

    fetch('https://seecreativa-api.azurewebsites.net/Api/Prices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token") 
      },
      body: JSON.stringify(dataToSend)
      
    })
      .then(response => response.json())
      .then(json => {
        console.log(json); // hacer algo con la respuesta recibida del servidor
        setIsLoading(false);
        setOpen(false);
        reloadData();

      })
      .catch(error => {
        console.error('Error:', error);
        setIsLoading(false);
      });

  };


  const handleOk = () => {
    setLoading(true);
    reloadData
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const columns : ColumnsType<priceResponseDto> = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Peso',
      dataIndex: 'minWeight',
      key: 'minWeight',
    },
    {
      title: 'Precio',
      dataIndex: 'minPrice',
      key: 'minPrice',
    },
    {
      title: 'Factor',
      dataIndex: 'factor',
      key: 'factor',
    },
    {
      title: 'Editar',
      key: 'action',
      render: (_, precio) => (
        <Space size="middle">
          <Button type='primary' onClick={() => showEdit(precio)} style={{ backgroundColor: 'green'}}>Editar</Button>
        </Space>
      ),
    },
    {
        title: 'Eliminar',
        key: 'eliminar',
        render: (_, precio) => (
          <Space size="middle">
            <Button type='primary' onClick={() => handleDelete(precio.id)} style={{ backgroundColor: 'red'}}>Eliminar</Button>
          </Space>
        ),
      },
    ];

    const handleDelete = (id: any) => {
      confirm({
        title: 'Confirmacion de eliminacion',
        icon: <ExclamationCircleFilled/>,
        content: '¿Seguro que quieres eliminar este tipo de precio?',
        onOk(){
          Http.Delete(`/Prices/${id}`, eval('')).then(() => {
          reloadData();
        });
      },
      onCancel(){
        console.log('cancel')
      }
    });
    };
  
    const reloadData = async() => {
      setLoading(true);
      
      await Http.Get<priceResponseDto[]>("/Prices").then((data) => {
        setPrecios(data);
      });
      setLoading(false);
    };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <Space>
          
        <Button onClick={showModal} type='primary' style={{ backgroundColor: 'purple', color: 'white'}}>
              Agregar nuevo
          </Button>
          <Modal
          open={open}
          title="Nuevo tipo de precio"
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleButtonClick} disabled={isLoading}>
              Agregar
            </Button>,
            <Button key="submit" type="primary" onClick={handleCancel}>
              Cancelar
            </Button>
          ]}
        >
          <p>Tipo<Input value={inputValue} onChange={handleInputChange} ></Input> </p>
          <p>Peso<Input value={pesoValue} onChange={handlePesoChange} ></Input> </p>
          <p>Precio<Input value={precioValue} onChange={handlePrecioChange} ></Input> </p>
          <p>Factor<Input value={factorValue} onChange={handleFactorChange} ></Input> </p>
        </Modal>
        
        <Space size="middle">
          <Modal
            open={edit}
            title="Editar precio"
            onOk={handleOkEdit}
            onCancel={handleeditCancel}
            key={trigger}
            footer={[ ]}
          >
            <Precio handleOk={handleOkEdit} price={precio} action='edit'/>
          </Modal>
          
        </Space>
        
        </Space>
        <Table columns={columns} dataSource={precios} />
      </div>
    );
  };
  export default App;