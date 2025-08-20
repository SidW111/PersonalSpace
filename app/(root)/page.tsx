import Chart from "@/components/Chart";
import { getUsageSummary } from "@/lib/utils";
import { getFiles, getTotalSpaceUsed } from "@/utils/actions/file.actions";
import { FileType } from "lucide-react";

export default async function Home() {
  const [file, totalSpace] = await Promise.all([
    getFiles({ types: [], limit: 10 }),
    getTotalSpaceUsed(),
  ]);
  const usageSummary = getUsageSummary(totalSpace);
  return (
    <div className="mx-auto max-w-7xl px-5 grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-10">
      <section>
        <Chart used={totalSpace.used} />
      </section>
      <section>ss</section>
    </div>
  );
}
