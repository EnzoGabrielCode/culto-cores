import { kv } from "@vercel/kv";

export default async function handler(request, response) {
  try {
    await kv.set("count:1", 40);
    await kv.set("count:2", 40);
    await kv.set("count:3", 40);
    await kv.set("count:4", 40);
    await kv.set("count:5", 40);
    await kv.set("count:6", 40);
    await kv.set("count:7", 40);

    return response
      .status(200)
      .json({ message: "Estoque carregado com sucesso!" });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
