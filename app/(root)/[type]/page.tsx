import Sort from "@/components/Sort";

export default async function page({ params }: SearchParamProps) {
  const type = (await params)?.type as string | " ";
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
      
    </div>
  );
}
