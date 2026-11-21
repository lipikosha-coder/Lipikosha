import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";

interface StepperProps {
  currentStep: 1 | 2 | 3;
}

export function Stepper({ currentStep }: StepperProps) {
  const steps = [
    { number: 1, label: "Cart", href: "/cart" },
    { number: 2, label: "Pay", href: "/checkout" },
    { number: 3, label: "Download", href: "/download" },
  ];

  return (
    <div className="flex items-center justify-center my-8">
      <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;

          return (
            <React.Fragment key={step.number}>
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                  isActive
                    ? "bg-[#0E3B23] text-white shadow-sm font-semibold"
                    : isCompleted
                    ? "bg-[#E6DEC8] text-[#0E3B23]"
                    : "text-[#8A7E6B] bg-white/60 border border-[#E6DEC8]"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    isActive
                      ? "bg-[#C6923A] text-white"
                      : isCompleted
                      ? "bg-[#0E3B23] text-white"
                      : "bg-[#E6DEC8] text-[#6B5E49]"
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : step.number}
                </span>
                <span>{step.label}</span>
              </div>

              {index < steps.length - 1 && (
                <span className="text-[#C6923A] font-bold">—</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
