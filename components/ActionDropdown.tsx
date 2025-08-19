"use client";

import { Models } from "node-appwrite";
import { Dialog } from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import Image from "next/image";
import { actionsDropdownItems } from "@/constants";
import { set } from "zod";
import Link from "next/link";
import { constructDownloadUrl } from "@/lib/utils";

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
};

export default function ActionDropdown({ file }: { file: FileDoc }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src="/assets/icons/dots.svg"
            alt="=dots"
            height={34}
            width={34}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((item) => (
            <DropdownMenuItem
              key={item.value}
              className="shad-dropdown-item"
              onClick={() => {
                setAction(item);
                if (
                  ["rename", "share", "delete", "details"].includes(item.value)
                ) {
                  setIsModalOpen(true);
                }
              }}
            >
              {item.value === "download" ?  <Link
                href={constructDownloadUrl(file.bucketFileId)}
                download={file.name}
                className="flex items-center gap-2"
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  height={30}
                  width={30}
                />
                {item.label}
              </Link>: <div className="flex items-center gap-2">
                <Image
                  src={item.icon}
                  alt={item.label}
                  height={30}
                  width={30}
                />
                {item.label}
              </div> }
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </Dialog>
  );
}
