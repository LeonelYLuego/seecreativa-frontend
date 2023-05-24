import { Input, Button, Form, Spin, notification} from "antd";
import { useEffect, useState } from "react";
import { classificationResponseDto } from "./dto/classification-response.dto";
import Http from "@/common/utils/classes/http";

export default function Clasificacion({
    handleOk,
    classification,
    action,
  }: {
    handleOk: any;
    classification?: classificationResponseDto;
    action?: string;
  }) {
    const [api, contextHolder] = notification.useNotification();
    const [loading, setLoading] = useState<boolean>(false);
    const [buttonName, setButtonName] = useState<string>("Agregar");
    const [clasificacion, setClasificacion] = useState<classificationResponseDto>({
      name: "",
    });
  
    useEffect(() => {
      if (action == "edit") {
        setButtonName("Editar");
        console.log("adiosin");
        if (classification != undefined) {
          setClasificacion(classification);
        }
      }
    }, []);
  
    const handleChange = (e: any) => {
      setClasificacion({
        ...clasificacion,
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
      clasificacion.name? clasificacion.name: openNotification("Nombre vacío", "El campo de nombre no puede estar vacío")
      
      if (clasificacion.name) {
        setLoading(true);
        console.log(clasificacion);
        if (action == "edit") {
          const req = await Http.Patch<classificationResponseDto>(
            "/Classifications/" + clasificacion.id,
            clasificacion
          ).then((data) => {});
          console.log(req);
        } else {
          const req = await Http.Post<classificationResponseDto>(
            "/Classifications",
            clasificacion
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
              { name: "name", value: clasificacion.name },
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
                value={clasificacion.name}
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
  