"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useLeads } from "@/lib/leads-store";

export function ClearAllLeadsButton() {
  const { leads, clearAllLeads } = useLeads();
  const [open, setOpen] = useState(false);
  const count = leads.length;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          disabled={count === 0}
          className="h-8 rounded-full px-2.5 text-[13px] font-semibold text-[#ff3b30] hover:bg-[#ff3b30]/10 hover:text-[#ff3b30] disabled:opacity-40"
        >
          Clear all
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-[20px] border-black/5 sm:max-w-[380px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[19px] font-semibold tracking-[-0.02em]">
            Clear all leads?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[14px] text-[#6e6e73]">
            This will permanently remove{" "}
            <span className="font-semibold text-[#1d1d1f]">
              {count} {count === 1 ? "lead" : "leads"}
            </span>{" "}
            from your map. Tags will be kept. This can’t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="rounded-full bg-[#ff3b30] text-white hover:bg-[#e0342b]"
            onClick={() => {
              clearAllLeads();
              setOpen(false);
            }}
          >
            Clear all leads
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
