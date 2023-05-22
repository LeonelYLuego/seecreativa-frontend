import { Input, Button, Form, Spin, notification, Switch} from "antd";
import { useEffect, useState } from "react";
import { userResponseDto } from "./dto/user-response.dto";
import Http from "@/common/utils/classes/http";
import Password from "antd/es/input/Password";

export default function User({
  handleOk,
  usuario,
  action,
}: {
  handleOk: any;
  usuario?: userResponseDto;
  action?: string;
}) {
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState<boolean>(false);
  const [buttonName, setButtonName] = useState<string>("Agregar");
  const [user, setUser] = useState<userResponseDto>({
    id: "",
    username: "",
    isAdmin: false,
    password: "",
  });

  useEffect(() => {
    if (action == "edit") {
      setButtonName("Editar");
      if (usuario != undefined) {
        setUser(usuario);
      }
    }
  }, []);

  const handleChange = (e: any) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

    const handleChangeSwitch = (checked: boolean) => {
    setUser({
        ...user,
        ["isAdmin"]: checked,
    });
    }


  const openNotification = (title: string, description: string) => {
    api['error']({
      message: title,
      description: description,
    })
  }

  const handleSubmit = async () => {
    if (user.username.length < 3) {
      openNotification("Error", "Introduce un nombre de usuario (3 caracteres mínimo)");
      return;
    }
    if (!user.password) {
        openNotification("Error", "Introduce una contraseña");
        return;
    } else if (user.password.length < 3) {
        openNotification("Error", "La contraseña debe tener al menos 3 caracteres");
        return;
    }

    setLoading(true);
    if (action == "edit") {
        const req = await Http.Patch<userResponseDto>(
          "/Users/" + user.id,
          user
        ).then((data) => {});
      } else {
        try {
          const req = await Http.Post<userResponseDto>(
            "/Users",
            user
          ).then((data) => {});
        }catch (e) {
            openNotification("Error", "El nombre de usuario ya existe");
            setLoading(false);
            return;
        }

        // const req = await Http.Post<userResponseDto>(
        //   "/Users",
        //   user
        // ).then((data) => {});
      }
      handleOk();
  };

  return (
    <div>
      {contextHolder}
      <Spin spinning={loading}>
        <Form
          fields={[
            { name: "username", value: user.username },
            { name: "isAdmin", value: user.isAdmin },
          ]}
          name="basic"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Form.Item
            label="Usuario"
            name="username"
            rules={[{ required: true, message: "Introduce un nombre de usuario" }]}
          >
            <Input
              onChange={handleChange}
              placeholder="Nombre de usuario"
              name="username"
              value={user.username}
            />
          </Form.Item>

          <Form.Item label="Contraseña" name="password" rules={[{required: true, message: "Introduce una contraseña"}]}>
            <Input type="password"
              onChange={handleChange}
              placeholder="Contraseña"
              name="password"
            />
          </Form.Item>

          <Form.Item label="Administrador" name="isAdmin">
            <Switch
                    checked={user.isAdmin}
                    onChange={handleChangeSwitch}
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
