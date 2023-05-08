import { Menu, Button } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";
import styles from "./style.module.css";
import Link from "next/link";
import { PATHS } from "@/common/utils/constants/paths.constant";

export default function NavBar() {
  const path = PATHS.PRODUCTS.DEFAULT;

  return (
    <div className={styles["nav-bar"]}>
      <div className={styles.logo}>
        <img src="/logo.svg" alt="Logo" />
      </div>
      <Menu
        theme="light"
        mode="horizontal"
        defaultSelectedKeys={[path]}
        className={styles.menu}
      >
        <Menu.Item key={PATHS.PRODUCTS.DEFAULT} icon={<AppstoreOutlined />}>
          <Link href={PATHS.PRODUCTS.DEFAULT}>Productos</Link>
        </Menu.Item>
      </Menu>
      <div className={styles["log-out"]}>
        <Button>Salir</Button>
      </div>
    </div>
  );
}
