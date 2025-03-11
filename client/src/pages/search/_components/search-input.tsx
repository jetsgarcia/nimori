import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SearchInputProps {
  triggerSearch: (search: string) => void;
}

export default function SearchInput({ triggerSearch }: SearchInputProps) {
  const [search, setSearch] = useState<string>("");

  return (
    <div className="mb-6 flex flex-col gap-2 sm:flex-row">
      <Input
        type="text"
        placeholder="Search anime..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            triggerSearch(search);
          }
        }}
      />
      <Button onClick={() => triggerSearch(search)} className="cursor-pointer">
        Search
      </Button>
    </div>
  );
}
