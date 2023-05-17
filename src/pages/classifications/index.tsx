import React, { useState, useEffect } from 'react';
import { Space, Table, Tag, Button, Modal, Input } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import Http from "@/common/utils/classes/http";
import Clasificacion from '@/common/components/classifications/add-edit-classifications';
import {classificationResponseDto} from '@/common/components/classifications/dto/classification-response.dto';

interface DataType {
  key: string;
  name: string;
}


const App = () => {
  const [isLoading2, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [clasificaciones, setClasificaciones] = useState<classificationResponseDto[]>([]);
  const [clasificacion, setClasificacion] = useState<classificationResponseDto>();
  const [trigger, setTrigger] = useState(0);

  const {confirm} = Modal;

  const showModal = () => {
    setOpen(true);
  };

  const showEdit = (clasificasionPass: any) => {
    setClasificacion(clasificasionPass);
    setTrigger(trigger + 1);
    console.log(clasificasionPass)
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

  useEffect(() => {
    reloadData();
  }, []);

  const handleButtonClick = () => {
    //setIsLoading(true);

    const dataToSend = {
      name: inputValue,
    };

    fetch('https://seecreativa-api.azurewebsites.net/Api/Classifications', {
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

  const columns : ColumnsType<classificationResponseDto> = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Editar',
      key: 'action',
      render: (_, clasificacion) => (
        <Space size="middle">
          <Button type='primary' onClick={() => showEdit(clasificacion)} style={{ backgroundColor: 'green'}}>Editar</Button>
        </Space>
      ),
    },
    {
        title: 'Eliminar',
        key: 'eliminar',
        render: (_, clasificacion) => (
          <Space size="middle">
            <Button type='primary' onClick={() => handleDelete(clasificacion.id)} style={{ backgroundColor: 'red'}}>Eliminar</Button>
          </Space>
        ),
      },
    ];

    const handleDelete = (id: any) => {
      confirm({
        title: 'Confirmacion de eliminacion',
        icon: <ExclamationCircleFilled/>,
        content: '¿Seguro que quieres eliminar esta clasificasión?',
        onOk(){
          Http.Delete(`/classifications/${id}`, eval('')).then(() => {
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
      await Http.Get<classificationResponseDto[]>("/classifications").then((data) => {
        setClasificaciones(data);
      });
      setLoading(false);
    };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <Space>
          
        <Button onClick={showModal} type='primary' style={{ backgroundColor: 'purple', color: 'white'}}>
              Agregar nueva Clasificacion
          </Button>
          <Modal
          open={open}
          title="Nueva Clasificacion"
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
          <p>Clasificacion <Input value={inputValue} onChange={handleInputChange} ></Input> </p>
        </Modal>
        
        <Space size="middle">
          <Modal
            open={edit}
            title="Editar Clasificacion"
            onOk={handleOkEdit}
            onCancel={handleeditCancel}
            key={trigger}
            footer={[ ]}
          >
            <Clasificacion handleOk={handleOkEdit} classification={clasificacion} action='edit'/>
          </Modal>
          
        </Space>
        
        </Space>
        <Table columns={columns} dataSource={clasificaciones} />
      </div>
    );
  };
  export default App;