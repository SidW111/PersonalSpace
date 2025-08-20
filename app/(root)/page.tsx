import ActionDropdown from "@/components/ActionDropdown";
import Chart from "@/components/Chart";
import FormattedDateTime from "@/components/FormattedDateTime";
import Thumbnail from "@/components/Thumbnail";
import { Separator } from "@/components/ui/separator";
import { convertFileSize, getUsageSummary } from "@/lib/utils";
import { getFiles, getTotalSpaceUsed } from "@/utils/actions/file.actions";
import Image from "next/image";
import Link from "next/link";
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

export default async function Home() {
  const [file, totalSpace] = await Promise.all([
    getFiles({ types: [], limit: 10 }),
    getTotalSpaceUsed(),
  ]);
  const usageSummary = getUsageSummary(totalSpace);
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 xl:gap-10 ">
      <section>
        <Chart used={totalSpace.used} />

        {/* Uploaded file type summaries */}
        <ul className="dashboard-summary-list">
          {usageSummary.map((summary) => (
            <Link
              href={summary.url}
              key={summary.title}
              className="dashboard-summary-card"
            >
              <div className="space-y-4">
                <div className="flex justify-between gap-3">
                  <Image
                    src={summary.icon}
                    width={100}
                    height={100}
                    alt="uploaded image"
                    className="summary-type-icon"
                  />
                  <h4 className="summary-type-size">
                    {convertFileSize(summary.size) || 0}
                  </h4>
                </div>

                <h5 className="summary-type-title">{summary.title}</h5>
                <Separator className="bg-light-400" />
                <FormattedDateTime
                  date={summary.latestDate}
                  className="text-center"
                />
              </div>
            </Link>
          ))}
        </ul>
      </section>
      <section className="h-full rounded-[20px] bg-white p-5 xl:p-8">
  <h2 className="h3 xl:h2 text-light-100">Recent file uploads</h2>
  {file.documents.length > 0 ? (
    <ul className="mt-5 flex flex-col gap-6">
      {file.documents.map((file: FileDoc) => (
        <Link
          href={file.url}
          target="_blank"
          className="flex items-center gap-3"
          key={file.$id}
        >
     
          <Thumbnail
            type={file.type}
            extension={file.extension}
            url={file.url}
          />


          <div className="flex w-full justify-between md:flex-row ">

            <div className="flex flex-col gap-1 text-left md:text-left">
              <p className="recent-file-name">{file.name}</p>
              <FormattedDateTime
                date={file.$createdAt}
                className="caption"
              />
            </div>

      
            <ActionDropdown file={file} />
          </div>
        </Link>
      ))}
    </ul>
  ) : (
    <p className="empty-list">No files uploaded</p>
  )}
</section>

    </div>
  );
}
