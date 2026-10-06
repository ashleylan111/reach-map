"use client";

import { useState } from "react";
import { Plus, Tag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useLeads } from "@/lib/leads-store";
import { TAG_COLOR_PRESETS } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ManageTagsDialog() {
  const { tags, addTag, updateTag, removeTag } = useLeads();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState<string>(TAG_COLOR_PRESETS[0]);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addTag(name, color);
    setName("");
    setColor(TAG_COLOR_PRESETS[(tags.length + 1) % TAG_COLOR_PRESETS.length]);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 gap-1.5 rounded-full px-2.5 text-[13px] font-semibold text-[#0071e3] hover:bg-[#0071e3]/10"
        >
          <Tag className="size-3.5" />
          Tags
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-0 overflow-hidden rounded-[20px] border-black/5 p-0 shadow-2xl sm:max-w-[400px]">
        <DialogHeader className="border-b border-black/5 px-5 py-4 text-left">
          <DialogTitle className="text-[19px] font-semibold tracking-[-0.02em]">
            Lead Tags
          </DialogTitle>
          <DialogDescription className="text-[13px] text-[#6e6e73]">
            Create your own tags to classify leads on the map.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleAdd}
          className="flex flex-wrap items-center gap-2 border-b border-black/5 px-5 py-4"
        >
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tag name"
            className="h-9 min-w-[140px] flex-1 rounded-xl border-transparent bg-[#787880]/12 text-[15px] shadow-none"
          />
          <div className="flex items-center gap-1">
            {TAG_COLOR_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                aria-label={`Color ${preset}`}
                onClick={() => setColor(preset)}
                className={cn(
                  "size-5 rounded-full border-2 transition-transform",
                  color === preset
                    ? "scale-110 border-[#1d1d1f]"
                    : "border-transparent",
                )}
                style={{ backgroundColor: preset }}
              />
            ))}
          </div>
          <Button
            type="submit"
            className="h-9 gap-1 rounded-full bg-[#0071e3] px-3 text-[13px] font-semibold text-white shadow-none hover:bg-[#0077ed]"
          >
            <Plus className="size-3.5" />
            Add
          </Button>
        </form>

        <ul className="max-h-[320px] space-y-1 overflow-y-auto px-3 py-3">
          {tags.map((tag) => (
            <li
              key={tag.id}
              className="flex items-center gap-2 rounded-xl px-2 py-2 hover:bg-[#787880]/08"
            >
              <input
                type="color"
                value={tag.color}
                onChange={(e) => updateTag(tag.id, { color: e.target.value })}
                className="size-7 cursor-pointer rounded-full border-0 bg-transparent p-0"
                aria-label={`Color for ${tag.name}`}
              />
              <Input
                value={tag.name}
                onChange={(e) => updateTag(tag.id, { name: e.target.value })}
                className="h-8 flex-1 rounded-lg border-transparent bg-transparent px-2 text-[15px] shadow-none"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="rounded-full text-[#ff3b30] hover:bg-[#ff3b30]/10 hover:text-[#ff3b30]"
                disabled={tags.length <= 1}
                onClick={() => removeTag(tag.id)}
                aria-label={`Delete ${tag.name}`}
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
