import { useEffect, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { PenBox } from "lucide-react";
import { toast } from "sonner";
import { updateBudget } from "../../api/finance";
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

export default function EditBudget({ budgetInfo, refreshData }) {
  const [open, setOpen] = useState(false);
  const [emojiIcon, setEmojiIcon] = useState("😊");
  const [showPicker, setShowPicker] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!budgetInfo) return;
    setEmojiIcon(budgetInfo.icon || "😊");
    setName(budgetInfo.name || "");
    setAmount(String(budgetInfo.amount ?? ""));
  }, [budgetInfo, open]);

  const submit = async (event) => {
    event.preventDefault();
    if (!budgetInfo?.id) return;
    setIsSubmitting(true);
    try {
      await updateBudget(budgetInfo.id, { name: name.trim(), amount: Number(amount), icon: emojiIcon });
      toast.success("Budget updated successfully!");
      setOpen(false);
      await refreshData?.();
    } catch (error) {
      toast.error(error.message || "Unable to update the budget.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2" disabled={!budgetInfo}>
          <PenBox /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>Update Budget</DialogTitle>
            <DialogDescription asChild>
              <div className="mt-5">
                <Button type="button" variant="outline" className="text-lg" onClick={() => setShowPicker((visible) => !visible)}>
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
              {isSubmitting ? "Updating…" : "Update Budget"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
