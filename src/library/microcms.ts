// SDK利用準備
import type { MicroCMSQueries, MicroCMSListContent } from "microcms-js-sdk";
import { createClient } from "microcms-js-sdk";

export const client = createClient({
  serviceDomain: import.meta.env.SERVICE_DOMEIN,
  apiKey: import.meta.env.API_KEY,
});

// 型定義

// カテゴリの型
export type Tag = {
  name: string;
} & MicroCMSListContent;

export type Blog = {
  title: string;
  publishedAt: string;
  thumbnail: { url: string; width: number; height: number };
  content: string;
  tags: Tag[];
} & MicroCMSListContent;

// APIの呼び出し
export const getTags = async (queries?: MicroCMSQueries) => {
  return await client.getList<Tag>({ endpoint: "tags", queries });
};

// タグ詳細を取得する関数数
export const getTagDetail = async (
  tagId: string, 
  queries?: MicroCMSQueries  // 必要に応じてクエリを追加
) => {
  const tag = await client.getListDetail({
    endpoint: "tags",
    contentId: tagId,  // 引数で受け取った tagId を使ってタグ情報を取得
    queries,
  });
  return tag;  // タグ詳細情報を返す
};
export const getBlogs = async (queries?: MicroCMSQueries) => {
  return await client.getList<Blog>({ endpoint: "articles", queries });
};

export const getBlogDetail = async (
  contentId: string,
  queries?: MicroCMSQueries
) => {
  const blog = await client.getListDetail<Blog>({
    endpoint: "articles",
    contentId,
    queries,
  });
  return blog;
};