import React, { useState } from "react";
import { Startup } from "@/data/types";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

interface GuideModalProps {
  startup: Startup;
  onClose: () => void;
}

const GuideModal: React.FC<GuideModalProps> = ({ startup, onClose }) => {
  const { submitGuideRequest } = useApp();
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    submitGuideRequest(startup.id, message);
    toast.success("Mentorship offer sent to the founders.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-card w-full max-w-md rounded-xl border border-border p-6 shadow-2xl animate-slide-up">
        <h3 className="text-xl font-bold mb-2">Offer Guidance</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Connect with the founders of {startup.name} to offer mentorship, strategic advice, or industry connections.
        </p>

        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">Intent Message (Optional)</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can you help them scale?"
          className="input-field min-h-[100px] resize-none mb-6 text-sm"
        />

        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary transition-colors text-foreground">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn-primary">
            Send Offer
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideModal;
