import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { analyzeLabelImage, fetchProductByCode, searchProductsByQuery } from "./nutrition.server";

export const getProductByBarcode = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ code: z.string().regex(/^\d{4,14}$/) }).parse(data))
  .handler(async ({ data }) => fetchProductByCode(data.code));

export const searchProducts = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ query: z.string().min(2).max(80) }).parse(data))
  .handler(async ({ data }) => searchProductsByQuery(data.query));

export const analyzeLabel = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({ image: z.string().startsWith("data:image/").max(7_000_000) }).parse(data),
  )
  .handler(async ({ data }) => analyzeLabelImage(data.image));
