"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

type CloseJobModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCloseJob: (jobId: string, reason: string) => void;
  jobId: string;
  jobTitle?: string;
};

export function CloseJobModal({ 
  isOpen, 
  onOpenChange, 
  onCloseJob, 
  jobId, 
  jobTitle = "" 
}: CloseJobModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCloseJob = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for closing this job.');
      return;
    }

    setIsSubmitting(true);

    try {
      onCloseJob(jobId, reason.trim());
      setReason(""); 
    } catch (error) {
      console.error('Error in modal:', error);
    
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] p-6 font-raleway">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-[#0A1754]">
            Send a note to Applicants that <br /> didn&apos;t get the job
          </DialogTitle>
          <DialogDescription className="text-lg text-gray-500 text-center font-extralight">
            Please be nice.
          </DialogDescription>
          {jobTitle && (
            <div className="text-center mt-2">
              <p className="text-sm text-gray-600 font-medium">
                Closing job: <span className="text-[#0A1754] font-semibold">{jobTitle}</span>
              </p>
            </div>
          )}
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason" className="sr-only">
              Reason for closing job
            </Label>
            <Textarea
              id="reason"
              placeholder="Type your note here..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[180px]"
              disabled={isSubmitting}
              maxLength={500}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {reason.length}/500 characters
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-center gap-3">
          <Button 
            type="button" 
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-8 py-6 text-lg font-medium font-raleway"
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleCloseJob} 
            disabled={!reason.trim() || isSubmitting}
            className="bg-[#1A2B5B] text-white cursor-pointer px-12 py-6 text-lg font-medium font-raleway hover:bg-opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Closing Job...
              </div>
            ) : (
              'Close Job'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}