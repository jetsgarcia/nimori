import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TriangleAlert } from "lucide-react";

interface SearchInputProps {
  triggerSearch: (search: string) => void;
}

export default function SearchInput({ triggerSearch }: SearchInputProps) {
  const [search, setSearch] = useState<string>("");
  const [open, setOpen] = useState(false);

  function handleSearch() {
    if (search.length && search.trim().length) triggerSearch(search);
    else setOpen(true);
  }

  return (
    <div className="mb-6 flex flex-col gap-2 sm:flex-row">
      <Input
        type="text"
        placeholder="Search anime..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
      />
      <Button onClick={() => handleSearch()} className="cursor-pointer">
        Search
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-400">
              <TriangleAlert size={20} /> <span>Error</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please enter a valid search term.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setOpen(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
