import Card from "@/components/Card";
import Sort from "@/components/Sort";
import { getFileTypesParams } from "@/lib/utils";
import { getFiles } from "@/utils/actions/file.actions";
import { Models } from "node-appwrite";

type FileDoc = Models.Document & {
  url: string;
  type: string;
  extension: string;
  size: number;
  name: string;
  bucketFileId: string;
  owner: {
    fullName: string;
  };
  users: string[];
};

export default async function page({ searchParams,params }: SearchParamProps) {
  const type = ((await params)?.type as string) || "";
  const searchText = ((await searchParams)?.query as string) || "";
    const sort = ((await searchParams)?.sort as string) || "";


  const types = getFileTypesParams(type) as FileType[];

  const files = await getFiles({types,searchText,sort});

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="capitalize h1">{type}</h1>
        <div className="total-size-section">
          <p className="body-1">
            Total: <span className="h5">0 MB</span>
          </p>
          <div className="sort-container">
            <p className="body-1 hidden sm:block text-light-200 ">Sort by:</p>
            <Sort />
          </div>
        </div>
      </section>
      {files.total > 0 ? (
        <section className="file-list">
          {files.documents.map((file: FileDoc) => (
            <Card key={file.$id} file={file} />
          ))}
        </section>
      ) : (
        <p className="empty-list">No files Uploaded</p>
      )}
    </div>
  );
}
