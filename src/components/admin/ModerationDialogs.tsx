import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ActionDialogProps extends DialogProps {
  laptopId: number | null;
  onAction: (id: number) => void;
}

export function ApproveDialog({
  open,
  onOpenChange,
  laptopId,
  onAction,
}: ActionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-800 border border-neutral-700 text-neutral-200">
        <DialogHeader>
          <DialogTitle>Approve Listing</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Are you sure you want to approve this listing? It will be visible to
            all users.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-neutral-700 text-neutral-200 hover:bg-neutral-600"
          >
            Cancel
          </Button>
          <Button
            onClick={() => laptopId && onAction(laptopId)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RejectDialog({
  open,
  onOpenChange,
  laptopId,
  onAction,
}: ActionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-800 border border-neutral-700 text-neutral-200">
        <DialogHeader>
          <DialogTitle>Reject Listing</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Are you sure you want to reject this listing? It will not be visible
            to users.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-neutral-700 text-neutral-200 hover:bg-neutral-600"
          >
            Cancel
          </Button>
          <Button
            onClick={() => laptopId && onAction(laptopId)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteDialog({
  open,
  onOpenChange,
  laptopId,
  onAction,
}: ActionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-800 border border-neutral-700 text-neutral-200">
        <DialogHeader>
          <DialogTitle>Delete Listing</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Are you sure you want to delete this listing? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-neutral-700 text-neutral-200 hover:bg-neutral-600"
          >
            Cancel
          </Button>
          <Button
            onClick={() => laptopId && onAction(laptopId)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface NukeDialogProps extends DialogProps {
  onAction: () => void;
}

export function NukeAllDialog({
  open,
  onOpenChange,
  onAction,
}: NukeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-800 border border-neutral-700 text-neutral-200">
        <DialogHeader>
          <DialogTitle className="text-red-500">
            ⚠️ DANGER: Delete ALL Listings
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            This will DELETE ALL LISTINGS from the database. This action CANNOT
            be undone! Are you absolutely sure?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-neutral-700 text-neutral-200 hover:bg-neutral-600"
          >
            Cancel
          </Button>
          <Button
            onClick={onAction}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete Everything
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ArchiveUserDialogProps extends DialogProps {
  laptopId: number | null;
  onAction: (id: number) => void;
}
export function ArchiveDialog({
  open,
  onOpenChange,
  laptopId,
  onAction,
}: ArchiveUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-800 border border-neutral-700 text-neutral-200">
        <DialogHeader>
          <DialogTitle>Archive User</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Are you sure you want to archive this user? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-neutral-700 text-neutral-200 hover:bg-neutral-600"
          >
            Cancel
          </Button>
          <Button
            onClick={() => laptopId && onAction(laptopId)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Archive
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
