import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { toast } from "sonner";
import { createBudget } from "../../api/finance";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

export default function CreateBudget({ refreshData }) {
  const [open, setOpen] = useState(false);
  const [emojiIcon, setEmojiIcon] = useState("😊");
  const [showPicker, setShowPicker] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reset = () => {
    setEmojiIcon("😊");
    setShowPicker(false);
    setName("");
    setAmount("");
  };

  const handleOpenChange = (nextOpen) => {
    setOpen(nextOpen);
    if (!nextOpen) reset();
  };

  const submit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await createBudget({ name: name.trim(), amount: Number(amount), icon: emojiIcon });
      toast.success("New budget created!");
      handleOpenChange(false);
      await refreshData?.();
    } catch (error) {
      toast.error(error.message || "Unable to create the budget.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger className="h-full w-full">
        <div className="flex h-full flex-col items-center justify-center rounded-md border-2 border-dashed border-primary bg-slate-100 p-10 hover:shadow-lg">
          <h2 className="text-3xl">+</h2>
          <h2>Create New Budget</h2>
        </div>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
            <DialogDescription asChild>
              <div className="mt-5">
                <Button
                  type="button"
                  variant="outline"
                  className="text-lg"
                  onClick={() => setShowPicker((visible) => !visible)}
                >
                  {emojiIcon}
                </Button>
                {showPicker && (
                  <div className="absolute z-20" style={{ transform: "scale(0.8)", transformOrigin: "top left" }}>
                    <EmojiPicker onEmojiClick={(emoji) => {
                      setEmojiIcon(emoji.emoji);
                      setShowPicker(false);
                    }} />
                  </div>
                )}
                <label className="mt-2 block text-sm font-medium text-black">
                  Budget Name
                  <Input className="mt-1" placeholder="e.g. Laptop" value={name} onChange={(event) => setName(event.target.value)} required />
                </label>
                <label className="mt-2 block text-sm font-medium text-black">
                  Budget Amount
                  <Input className="mt-1" placeholder="e.g. 50000" type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} required />
                </label>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-5 sm:justify-start">
            <Button className="w-full" type="submit" disabled={!name.trim() || !Number(amount) || isSubmitting}>
              {isSubmitting ? "Creating…" : "Create Budget"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
