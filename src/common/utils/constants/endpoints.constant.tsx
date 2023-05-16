const RESOURCES = {
  PRODUCTS: "/Products",
  CLASSIFICATIONS: "/Classifications",
};

export const ENDPOINTS = {
  PRODUCTS: {
    BASE: RESOURCES.PRODUCTS,
    BY_ID: (id: string) => {
      return `${RESOURCES.PRODUCTS}/${id}`;
    },
  },
  CLASSIFICATIONS: {
    BASE: RESOURCES.CLASSIFICATIONS,
    BY_ID: (id: string) => {
      return `${RESOURCES.CLASSIFICATIONS}/${id}`;
    },
  },
};
