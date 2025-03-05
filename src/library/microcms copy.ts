// SDK利用準備
import type { MicroCMSQueries, MicroCMSListContent } from "microcms-js-sdk";
import { createClient } from "microcms-js-sdk";

const client = createClient({
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
  categories: Tag[]; // タグのリストを持つ
} & MicroCMSListContent;

// APIの呼び出し
export const getTags = async (queries?: MicroCMSQueries) => {
  return await client.getList<Tag>({ endpoint: "tags", queries });
};


// カテゴリの詳細を取得する関数を追加
export const getTagDetail = async (tagId: string) => {
  return await client.getListDetail<Tag>({
    endpoint: "tags",
    contentId: tagId,
  });
};

// APIの呼び出し
export const getBlogs = async (queries?: MicroCMSQueries) => {
  return await client.getList<Blog>({ endpoint: "articles", queries });
};

export const getBlogDetail = async (
  contentId: string,
  queries?: MicroCMSQueries
) => {
  return await client.getListDetail<Blog>({
    endpoint: "articles",
    contentId,
    queries,
  });
};