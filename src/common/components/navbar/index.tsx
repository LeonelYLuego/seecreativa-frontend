import { Menu, Button, MenuProps } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";
import styles from "./style.module.css";
import { PATHS } from "@/common/utils/constants/paths.constant";
import { useRouter } from "next/router";
import Image from "next/image";

export default function NavBar() {
  const router = useRouter()
  const path = router.pathname;

  const salir_sesion = () => {
    console.log("Sesion eliminada en local Storage");
    localStorage.clear();
    router.push('/');
  };

  const items: MenuProps['items'] = [
    {
      key: PATHS.PRODUCTS.DEFAULT,
      label: (
        <a href={PATHS.PRODUCTS.DEFAULT}>Productos</a>
      ),
      icon: <AppstoreOutlined />,

    },
    {
      key: PATHS.ORDERS.DEFAULT,
      label: (
        <a href={PATHS.ORDERS.DEFAULT}>Ordenes</a>
      ),
      icon: <AppstoreOutlined />,
    },
    {
      key: PATHS.CLIENTS.DEFAULT,
      label: (
        <a href={PATHS.CLIENTS.DEFAULT}>Clientes</a>
      ),
      icon: <AppstoreOutlined />,
    },
    {
      key: 'sub1',
      label: 'Otros',
      icon: <AppstoreOutlined />,
      children: [
        {
          key: PATHS.CLASSIFICATIONS.DEFAULT,
          label: (
            <a href={PATHS.CLASSIFICATIONS.DEFAULT}>Clasificaciones</a>
          ),
        },
        {
          key: PATHS.PRICES.DEFAULT,
          label: (
            <a href={PATHS.PRICES.DEFAULT}>Precios</a>
          ),
        },
        {
          key: PATHS.USERS.DEFAULT,
          label: (
            <a href={PATHS.USERS.DEFAULT}>Usuarios</a>
          ),
        },
      ],
    },
  ];

  if (path == "/" || path == "/login")
  return <></>

  return (
    <div className={styles["nav-bar"]}>
      <div className={styles.logo}>
        <Image className={styles["image"]} src="logo.svg" alt="Logo" width={90} height={40}/>
      </div>
      <Menu
        theme="light"
        mode="horizontal"
        defaultSelectedKeys={[path]}
        className={styles.menu}
        items={items}
      />
      <div className={styles["log-out"]}>
        <Button onClick={salir_sesion} type="primary">Salir</Button>
      </div>
    </div>
  );
}
