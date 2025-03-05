import { client } from "../library/microcms";

// fetchContentOrPreview 関数の引数として受け取るオブジェクトの型を定義
type Params = {
  endpoint: string;
  id: string;
  draftKey?: string | null;
}

// 公開中または下書き中の詳細データを取得する非同期関数
export const fetchContentOrPreview = async <T>({ endpoint, id, draftKey }: Params) => {
  try {
    // microCMS API から詳細データを取得
    return await client.getListDetail<T>({
      endpoint: endpoint,
      contentId: id,
      queries: draftKey ? { draftKey } : {},
    });
  } catch (error) {
    // エラー発生時は null を返す
    return null;
  }
};