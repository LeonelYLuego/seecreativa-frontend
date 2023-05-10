export default class Http {
  public static async Get<T>(url: string): Promise<T> {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const res = await fetch(`${serverUrl}${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.ok) {
      const response = (await res.json()) as T;
      return response;
    } else {
      const { message } = await res.json();
      throw new Error(message);
    }
  }

  public static async Post<T>(url: string, body: object): Promise<T> {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const res = await fetch(`${serverUrl}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const response = (await res.json()) as T;
      return response;
    } else {
      const { message } = await res.json();
      throw new Error(message);
    }
  }

  public static async Put<T>(url: string, body: object): Promise<T> {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const res = await fetch(`${serverUrl}${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const response = (await res.json()) as T;
      return response;
    } else {
      const { message } = await res.json();
      throw new Error(message);
    }
  }

  public static async Patch<T>(url: string, body: object): Promise<T> {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const res = await fetch(`${serverUrl}${url}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const response = (await res.json()) as T;
      return response;
    } else {
      const { message } = await res.json();
      throw new Error(message);
    }
  }

  public static async Delete<T>(url: string, body: object): Promise<T> {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const res = await fetch(`${serverUrl}${url}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const response = (await res.json()) as T;
      return response;
    } else {
      const { message } = await res.json();
      throw new Error(message);
    }
  }
}
