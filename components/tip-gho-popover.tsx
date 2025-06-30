import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Coins } from "lucide-react";

interface TipGhoPopoverProps {
  disabled?: boolean;
  onSend?: (amount: number) => void;
}

export function TipGhoPopover({ disabled, onSend }: TipGhoPopoverProps) {
  const [tipAmount, setTipAmount] = useState<number | null>(null);
  const [customMode, setCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState(1);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full text-green-600 hover:text-green-700"
          disabled={disabled}
        >
          <Coins className="mr-2 h-4 w-4" />
          Tip
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-4">
        <div className="mb-3 text-center text-sm font-semibold text-gray-800">Send a tip in $GHO</div>
        <div className="flex flex-col items-center gap-3">
          {/* Quick tip buttons as a horizontal group */}
          <div className="flex w-full justify-center gap-2">
            {[1, 5, 10].map(val => (
              <Button
                key={val}
                size="sm"
                variant={tipAmount === val && !customMode ? "default" : "outline"}
                className={`flex-1 rounded-full px-0 py-2 font-semibold transition-all duration-150 ${tipAmount === val && !customMode ? "scale-105 ring-2 ring-green-200" : "hover:scale-105"}`}
                onClick={() => {
                  setTipAmount(val);
                  setCustomMode(false);
                }}
              >
                {val} GHO
              </Button>
            ))}
            <Button
              size="sm"
              variant={customMode ? "default" : "outline"}
              className={`flex-1 rounded-full px-0 py-2 font-semibold transition-all duration-150 ${customMode ? "scale-105 ring-2 ring-green-200" : "hover:scale-105"}`}
              onClick={() => {
                setCustomMode(true);
                setTipAmount(customValue);
              }}
            >
              Custom
            </Button>
          </div>
          {/* Divider */}
          <div className="w-full border-t border-dashed border-gray-200" />
          {/* Custom input, animated in */}
          <div
            className={`w-full transition-all duration-200 ${customMode ? "max-h-20 opacity-100" : "max-h-0 overflow-hidden opacity-0"}`}
          >
            <label className="mb-1 block text-xs font-medium text-gray-500" htmlFor="custom-gho-amount">
              Custom amount
            </label>
            <Input
              id="custom-gho-amount"
              type="number"
              min={0.01}
              step={0.01}
              value={customValue}
              onChange={e => {
                const v = parseFloat(e.target.value);
                setCustomValue(isNaN(v) ? 1 : v);
                setTipAmount(isNaN(v) ? 1 : v);
              }}
              placeholder="Amount (GHO)"
              className="mb-2 text-center text-lg font-semibold"
            />
          </div>
          {/* Send button */}
          <Button
            size="sm"
            className="w-full rounded-full font-semibold shadow-sm"
            disabled={!tipAmount || tipAmount <= 0}
            onClick={() => {
              if (tipAmount && tipAmount > 0 && onSend) onSend(tipAmount);
            }}
          >
            Send Tip
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
