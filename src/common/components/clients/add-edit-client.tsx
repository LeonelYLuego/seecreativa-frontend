import { Input, Button, Form, Spin, notification} from "antd";
import { useEffect, useState } from "react";
import { clientResponseDto } from "./dto/client-response.dto";
import Http from "@/common/utils/classes/http";
import { type } from "os";
import { open } from "fs/promises";

export default function Clients({
  handleOk,
  client,
  action,
}: {
  handleOk: any;
  client?: clientResponseDto;
  action?: string;
}) {
  const [api, contextHolder] = notification.useNotification();
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

  const openNotification = (title: string, description: string) => {
    api['error']({
      message: title,
      description: description,
    })
  }

  const handleSubmit = async () => {
    var valRfc = false;
    var valEmail = false;
    var valPhone = false;

    cliente.rfc
      ? (cliente.rfc = cliente.rfc.toUpperCase())
      : (cliente.rfc = undefined);
    cliente.address ? cliente.address : (cliente.address = undefined);
    cliente.email
      ? (cliente.email = cliente.email.toLowerCase())
      : (cliente.email = undefined);
    cliente.phone ? (cliente.phone = cliente.phone) : (cliente.phone = undefined);

    const rfcRegex = /^[A-Z]{4}[0-9]{6}[A-Z0-9]{3}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const numeroRegex = /^\d{10}$/;

    // Validar el formato del RFC
    cliente.rfc ? (valRfc = rfcRegex.test(cliente.rfc)) : (valRfc = true);
    // validar el formato del correo
    cliente.email
      ? (valEmail = emailRegex.test(cliente.email))
      : (valEmail = true);
    // validar el formato del telefono
    cliente.phone
      ? (valPhone = numeroRegex.test(cliente.phone))
      : (valPhone = true);
    cliente.name? cliente.name: openNotification("Nombre vacío", "El campo de nombre no puede estar vacío")
    valRfc ? (valRfc = true) : openNotification("RFC no válido", "El RFC introducido no es válido");
    valEmail ? (valEmail = true) : openNotification("Correo no válido", "El correo introducido no es válido");
    valPhone ? (valPhone = true) : openNotification("Teléfono no válido", "El número de teléfono introducido no es válido");

    if (valRfc && valEmail && valPhone && cliente.name) {
      setLoading(true);
      console.log(cliente);
      if (action == "edit") {
        const req = await Http.Patch<clientResponseDto>(
          "/Clients/" + cliente.id,
          cliente
        ).then((data) => {});
        console.log(req);
      } else {
        const req = await Http.Post<clientResponseDto>(
          "/Clients",
          cliente
        ).then((data) => {});
      }
      handleOk();
    }
  };

  return (
    <div>
      {contextHolder}
      <Spin spinning={loading}>
        <Form
          fields={[
            { name: "name", value: cliente.name },
            { name: "rfc", value: cliente.rfc },
            { name: "address", value: cliente.address },
            { name: "email", value: cliente.email },
            { name: "phone", value: cliente.phone },
          ]}
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
              value={cliente.name}
            />
          </Form.Item>

          <Form.Item label="RFC" name="rfc">
            <Input
              onChange={handleChange}
              placeholder="RFC"
              name="rfc"
              value={cliente.rfc}
            />
          </Form.Item>

          <Form.Item label="Dirección" name="address">
            <Input
              onChange={handleChange}
              placeholder="Dirección"
              name="address"
              value={cliente.address}
            />
          </Form.Item>

          <Form.Item label="Correo" name="email">
            <Input
              onChange={handleChange}
              placeholder="Correo"
              name="email"
              value={cliente.email}
            />
          </Form.Item>

          <Form.Item label="Teléfono" name="phone">
            <Input
              onChange={handleChange}
              placeholder="Teléfono (10 dígitos)"
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
      </Spin>
    </div>
  );
}
