import { TriangleAlert } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface DeleteConfirmationDialogProps {
  isDeleteConfirmationVisible: boolean;
  setIsDeleteConfirmationDialogVisible: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  deleteAction: () => void;
}

export default function DeleteConfirmationDialog({
  isDeleteConfirmationVisible,
  setIsDeleteConfirmationDialogVisible,
  deleteAction,
}: DeleteConfirmationDialogProps) {
  return (
    <AlertDialog
      open={isDeleteConfirmationVisible}
      onOpenChange={setIsDeleteConfirmationDialogVisible}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-center gap-2 text-red-400 md:justify-start">
            <TriangleAlert size={20} /> <span>Warning</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove this anime from your watchlist?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            className="cursor-pointer bg-transparent text-black hover:bg-gray-200 dark:text-white dark:hover:bg-gray-800"
            onClick={() => setIsDeleteConfirmationDialogVisible(false)}
          >
            Cancel
          </AlertDialogAction>
          <AlertDialogAction
            className="cursor-pointer bg-red-700 text-white hover:bg-red-600"
            onClick={deleteAction}
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
