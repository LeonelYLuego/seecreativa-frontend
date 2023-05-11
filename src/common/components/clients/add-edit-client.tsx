import { Input, Button, Form, Spin } from "antd";
import { useEffect, useState } from "react";
import { clientResponseDto } from "./dto/client-response.dto";
import Http from "@/common/utils/classes/http";
import { type } from "os";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Clients({
  handleOk,
  client,
  action,
}: {
    handleOk: any;
  client?: clientResponseDto;
  action?: string;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [buttonName, setButtonName] = useState<string>("Agregar");
  const [cliente, setCliente] = useState<clientResponseDto>({
    name: "",
    rfc: "",
    email: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    if (action == "edit") {
      setButtonName("Editar");
      console.log("adiosin");
      if (client != undefined) {
        setCliente(client);
      }
    }
  }, []);

  const handleChange = (e: any) => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value,
    });
  }; 

  const handleSubmit = async () => {
    var valRfc = false
    var valEmail = false
    var valPhone = false
    
    cliente.rfc? cliente.rfc = cliente.rfc.toUpperCase(): cliente.rfc = null;
    cliente.address? cliente.address: cliente.address = null;
    cliente.email? cliente.email = cliente.email.toLowerCase(): cliente.email = null;
    cliente.phone? cliente.phone = cliente.phone: cliente.phone = null;

    const rfcRegex = /^[A-Z]{4}[0-9]{6}[A-Z0-9]{3}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const numeroRegex = /^\d{10}$/;

    // Validar el formato del RFC
    cliente.rfc? valRfc = rfcRegex.test(cliente.rfc): valRfc = true;
    // validar el formato del correo
    cliente.email? valEmail = emailRegex.test(cliente.email): valEmail = true;
    // validar el formato del telefono
    cliente.phone? valPhone = numeroRegex.test(cliente.phone): valPhone = true;

    valRfc? valRfc = true: toast.error("El RFC no es válido");
    valEmail? valEmail = true: toast.error("El correo no es válido");
    valPhone? valPhone = true: toast.error("El teléfono no es válido");

    
    
    if (valRfc && valEmail && valPhone && cliente.name)
    {
      setLoading(true);
      console.log(cliente)
        if (action == "edit") {
            const req = await Http.Patch<clientResponseDto>("/Clients/" + cliente.id, cliente).then(
                (data) => {}
            );
            console.log(req);
        }
        else{
            const req = await Http.Post<clientResponseDto>("/Clients", cliente).then(
                (data) => {}
            );
        }
        handleOk();
    }
  };

  return (
    <div>
      <Spin spinning={loading}>
      <Form
        fields={[{ name: "name", value: cliente.name }, { name: "rfc", value: cliente.rfc }, { name: "address", value: cliente.address }, { name: "email", value: cliente.email }, { name: "phone", value: cliente.phone }]}
        name="basic"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        autoComplete="off"
      >
        <Form.Item
          label="Nombre"
          name="name"
          rules={[{ required: true, message: "Introduce un nombre" }]}
        >
          <Input 
            onChange={handleChange}
            placeholder="Nombre"
            name="name"
            value={cliente.name}/>
        </Form.Item>

        <Form.Item
          label="RFC"
          name="rfc"
        >
        <Input
          onChange={handleChange}
          placeholder="RFC"
          name="rfc"
          value={cliente.rfc}
        />
        </Form.Item>
        
        <Form.Item
          label="Dirección"
          name="address"
        >
        <Input
          onChange={handleChange}
          placeholder="Dirección"
          name="address"
          value={cliente.address}
        />
        </Form.Item>
        
        <Form.Item
          label="Correo"
          name="email"
        >
        <Input
            onChange={handleChange}
            placeholder="Correo"
            name="email"
            value={cliente.email}
        />
        </Form.Item>

        <Form.Item
            label="Teléfono"
            name="phone"
        >
        <Input
            onChange={handleChange}
            placeholder="Teléfono"
            name="phone"
            value={cliente.phone}
        />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
          <Button onClick={handleSubmit} type="primary" htmlType="submit">
            {buttonName}
          </Button>
        </Form.Item>
      </Form>
      <ToastContainer />
      </ Spin>
    </div>
  );
}