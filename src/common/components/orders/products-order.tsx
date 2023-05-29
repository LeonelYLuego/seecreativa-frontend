import { Table, Space, Spin } from 'antd';
import { useEffect, useState } from "react";
import Http from "@/common/utils/classes/http";
import { ProductResponseDto } from '../products/dto/product-response.dto';

type ProductsOrderProps = {
    productList: ProductResponseDto[];
  };

export default function ProductsOrder({ productList }: ProductsOrderProps) {
    const [products, setProducts] = useState<ProductResponseDto[]>([]);
    const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'productId',
            key: 'productId',
            render: (value: string) => (
                <Space size="middle">
                    {getProductName(value)}
                </Space>
            ),
        },
        {
            title: 'Cantidad',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Entregados',
            dataIndex: 'delivered',
            key: 'delivered',
        },
        {
            title: 'Precio',
            dataIndex: 'price',
            key: 'price',
        },
    ];

    useEffect(() => {
        reloadData();
    }, []);

    const reloadData = async () => {
        setLoading(true);
        await Http.Get<ProductResponseDto[]>('/products').then((data) => {
            setProducts(data);
        });
        setLoading(false);
    }
    const getProductName = (id: string) => {
        const product = products.find((product) => product.id === id);
        var name = "" 
        product? name = product.name : name = "No encontrado"
        return name;
    }

    return (
        <div>
            <Spin spinning={loading}>
                <Table columns={columns} dataSource={productList} rowKey='id' />
            </Spin>
        </div>
    )
}


