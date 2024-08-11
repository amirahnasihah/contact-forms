import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, CircleDashed } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

// Define the type for the props
interface StatusButtonProps<T> {
  onSubmit: (values: T) => Promise<void>;
  formValues: T;
}

// Utility function to wait for a given number of milliseconds
const wait = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export default function StatusButton<T>({
  onSubmit,
  formValues,
}: StatusButtonProps<T>) {
  const [status, setStatus] = useState<"loading" | "Submit" | "Sent">();
  const isEnabled = !status || status === "Submit";

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!isEnabled) {
      return;
    }

    setStatus("loading");
    await onSubmit(formValues);
    setStatus("Sent");
    await wait(1500);
    setStatus("Submit");
  };

  return (
    <Button
      type="submit"
      onClick={handleSubmit}
      disabled={!isEnabled}
      className="group relative h-10 min-w-40 overflow-hidden rounded-md bg-primary text-primary-foreground hover:bg-primary/90 px-6 text-sm font-semibold transition-colors duration-300 "
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={status}
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ duration: 0.075 }}
          className={cn("flex items-center justify-center gap-1")}
        >
          {status === "Sent" && (
            <motion.span
              className="h-fit w-fit"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.075, type: "spring" }}
            >
              <CheckCircle2 className="h-4 w-4 fill-white stroke-teal-500 group-hover:stroke-teal-600" />
            </motion.span>
          )}

          {status === "loading" ? (
            <CircleDashed className="h-4 w-4 animate-spin" />
          ) : (
            status ?? "Submit"
          )}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}
