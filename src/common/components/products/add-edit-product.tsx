import Http from "@/common/utils/classes/http";
import {
  ValidateFloat,
  ValidateRequiredFloat,
} from "@/common/utils/validators/form-validators";
import {
  Button,
  Form,
  FormInstance,
  Input,
  Modal,
  Select,
  notification,
} from "antd";
import { useState, useEffect, useRef } from "react";
import ClassificationResponseDto from "../classifications/dto/classification-response.dto";
import { ProductCreateDto } from "./dto/product-create.dto";
import { ENDPOINTS } from "@/common/utils/constants/endpoints.constant";
import { ProductUpdateDto } from "./dto/product-update.dto";
import { Product } from "./product";
import { ProductWithClassificationResponseDto } from "./dto/product-with-classification-response.dto";

export default function AddEditProduct(props: {
  getProducts: () => void;
  edit?: string;
}) {
  const [classifications, setClassifications] = useState<
    ClassificationResponseDto[]
  >([]);
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formRef = useRef<FormInstance>(null);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    Http.Get<ClassificationResponseDto[]>(ENDPOINTS.CLASSIFICATIONS.BASE)
      .then((data) => {
        setClassifications(data);
      })
      .catch((error) => {
        api["error"]({
          message: "Ha ocurrido un error al obtener las clasificaciones",
        });
      });
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
    if (props.edit) {
      Http.Get<ProductWithClassificationResponseDto>(
        ENDPOINTS.PRODUCTS.BY_ID(props.edit)
      )
        .then((data) => {
          setProduct({
            ...data,
            classificationId: data.classification.id,
          });
          formRef.current!.setFieldsValue({
            classification: data.classification.id,
            code: data.code,
            height: data.height,
            name: data.name,
            weight: data.weight,
            diameter: data.diameter ?? "",
            length: data.length ?? "",
            width: data.width ?? "",
          });
        })
        .catch((error) => {
          api["error"]({
            message: "Ha ocurrido un error al obtener el producto",
          });
        });
    }
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        const values = form.getFieldsValue();
        if (props.edit) {
          const editedProduct: ProductUpdateDto = {
            classificationId: values.classification,
            code: values.code == product!.code ? undefined : values.code,
            height: values.height,
            name: values.name,
            weight: values.weight,
            diameter:
              values.diameter == "" || values.diameter == null
                ? undefined
                : values.diameter,
            length:
              values.length == "" || values.length == null
                ? undefined
                : values.length,
            width:
              values.width == "" || values.width == null
                ? undefined
                : values.width,
          };
          Http.Patch<ClassificationResponseDto>(
            ENDPOINTS.PRODUCTS.BY_ID(props.edit),
            editedProduct
          )
            .then((data) => {
              props.getProducts();
              formRef.current!.resetFields();
              setIsModalOpen(false);
            })
            .catch((error) => {
              api["error"]({
                message: "Ha ocurrido un error al editar el producto",
              });
            });
        } else {
          const product: ProductCreateDto = {
            classificationId: values.classification,
            code: values.code,
            height: values.height,
            name: values.name,
            weight: values.weight,
            diameter:
              values.diameter == "" || values.diameter == null
                ? undefined
                : values.diameter,
            length:
              values.length == "" || values.length == null
                ? undefined
                : values.length,
            width:
              values.width == "" || values.width == null
                ? undefined
                : values.width,
          };
          Http.Post<ClassificationResponseDto>(ENDPOINTS.PRODUCTS.BASE, product)
            .then((data) => {
              props.getProducts();
              formRef.current!.resetFields();
              setIsModalOpen(false);
            })
            .catch((error) => {
              api["error"]({
                message: "Ha ocurrido un error al obtener el producto",
              });
            });
        }
      })
      .catch((error: any) => {});
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    formRef.current!.resetFields();
  };

  return (
    <>
      {contextHolder}
      <Button type="primary" onClick={showModal}>
        {props.edit ? "Editar Producto" : "Agregar Producto"}
      </Button>
      <Modal
        title={props.edit ? "Editar Producto" : "Agregar Producto"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          ref={formRef}
          form={form}
          name="add-edit-product"
          layout="vertical"
        >
          <Form.Item
            label="Clasificación"
            name="classification"
            rules={[
              {
                required: true,
                message: "Clasificación Inválida",
              },
            ]}
          >
            <Select>
              {classifications.map((classification) => (
                <Select.Option
                  key={classification.id}
                  value={classification.id}
                >
                  {classification.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Código"
            name="code"
            rules={[
              {
                required: true,
                message: "Código Inválido",
                pattern: /^[A-Z]{1,2}\d{1,3}$/,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Nombre"
            name="name"
            rules={[
              {
                required: true,
                message: "Nombre Inválido",
                len: 255,
                validator(rule, value: string, callback) {
                  if (value == undefined) callback("Nombre Inválido");
                  else if (value.length < 3 || value.length > 255)
                    callback("Nombre Inválido");
                  else callback();
                },
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Peso"
            name="weight"
            rules={[
              {
                required: true,
                message: "Peso Inválido",
                validator: ValidateRequiredFloat("Peso Inválido"),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Largo"
            name="length"
            rules={[
              {
                required: false,
                message: "Largo Inválido",
                validator: ValidateFloat("Largo Inválido"),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Ancho"
            name="width"
            rules={[
              {
                required: false,
                message: "Ancho Inválido",
                validator: ValidateFloat("Ancho Inválido"),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Alto"
            name="height"
            rules={[
              {
                required: true,
                message: "Alto Inválido",
                validator: ValidateRequiredFloat("Alto Inválido"),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Diámetro"
            name="diameter"
            rules={[
              {
                required: false,
                message: "Diámetro Inválido",
                validator: ValidateFloat("Diámetro Inválido"),
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
