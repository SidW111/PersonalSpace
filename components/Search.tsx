"use client";

import Image from "next/image";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { set } from "zod";
import { Models } from "node-appwrite";
import { getFiles } from "@/utils/actions/file.actions";
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";
import { useDebounce } from "use-debounce";

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

export default function Search() {
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [results, setResults] = useState<FileDoc[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const [debounceQuery] = useDebounce(query, 300); 

  useEffect(() => {
    const fetchFiles = async () => {
        if (debounceQuery.length === 0) {
          setResults([]);
            setOpen(false);
            
          return router.push(path.replace(searchParams.toString(), ""));
        }
      const files = await getFiles({ types:[], searchText: debounceQuery });
      setResults(files.documents);
      setOpen(true);
    };
    fetchFiles();
  }, [debounceQuery]);
  useEffect(() => {
    if (searchQuery) {
      setQuery(searchQuery);
    }
  }, [searchQuery]);

  const handleClick = (file: FileDoc) => {
    setOpen(false);
    setResults([]);
    router.push(`/${(file.type === 'video'  || file.type === 'audio')? 'media' : file.type + 's'}?query=${query}`);
  }
  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image
          src="/assets/icons/search.svg"
          alt="Search Icon"
          width={24}
          height={24}
        />
        <Input
          placeholder="Search..."
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          className="search-input"
        />
        {open && (
          <ul className="search-result">
            {results.length > 0 ? (
              results.map((file) => (
                <li
                onClick={() => handleClick(file)}
                  key={file.$id}
                  className="flex items-center justify-between"
                >
                  <div className="flex cursor-pointer items-center gap-4">
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className={"size-9 min-w-9"}
                    />
                    <p className="subtitle-2 line-clamp-1 text-light-100"></p> {file.name}
                  </div>
                  <FormattedDateTime  date={file.$createdAt} className="caption line-clamp-1 text-light-200" />
                </li>
              ))
            ) : (
              <p className="empty-results">No files found</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
