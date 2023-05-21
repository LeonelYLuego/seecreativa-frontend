import { Input, Button, Form, Spin, notification} from "antd";
import { useEffect, useState } from "react";
import { priceResponseDto } from "./dto/price-response.dto";
import Http from "@/common/utils/classes/http";

export default function Precio({
    handleOk,
    price,
    action,
  }: {
    handleOk: any;
    price?: priceResponseDto;
    action?: string;
  }) {
    const [api, contextHolder] = notification.useNotification();
    const [loading, setLoading] = useState<boolean>(false);
    const [buttonName, setButtonName] = useState<string>("Agregar");
    const [precio, setPrecio] = useState<priceResponseDto>({
      name: "",
      minWeight: 0,
      minPrice: 0,
      factor: 0
    });
  
    useEffect(() => {
      if (action == "edit") {
        setButtonName("Editar");
        console.log("adiosin");
        if (price != undefined) {
          setPrecio(price);
        }
      }
    }, []);
  
    const handleChange = (e: any) => {
      setPrecio({
        ...precio,
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
      precio.name? precio.name: openNotification("Nombre vacío", "El campo de nombre no puede estar vacío")
      
      if (precio.name) {
        setLoading(true);
        console.log(precio);
        if (action == "edit") {
          const req = await Http.Patch<priceResponseDto>(
            "/Classifications/" + precio.id,
            precio
          ).then((data) => {});
          console.log(req);
        } else {
          const req = await Http.Post<priceResponseDto>(
            "/Classifications",
            precio
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
              { name: "name", value: precio.name },
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
                value={precio.name}
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
  