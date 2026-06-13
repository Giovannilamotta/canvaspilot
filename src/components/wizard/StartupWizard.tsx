"use client";

import { useState } from "react";
import { useOnboardingStore } from "@/stores/onboarding";
import { StartupType, Industry, Phase, Geography, BusinessModel } from "@/types";

const steps = [
  {
    title: "Tipo di Startup",
    field: "startupType" as const,
    options: [
      { value: "saas" as StartupType, label: "SaaS" },
      { value: "ecommerce" as StartupType, label: "E-commerce" },
      { value: "food" as StartupType, label: "Food" },
      { value: "fintech" as StartupType, label: "FinTech" },
      { value: "services" as StartupType, label: "Servizi" },
      { value: "other" as StartupType, label: "Altro" },
    ],
  },
  {
    title: "Settore / Industria",
    field: "industry" as const,
    options: [
      { value: "technology" as Industry, label: "Tecnologia" },
      { value: "food" as Industry, label: "Alimentare" },
      { value: "fashion" as Industry, label: "Moda" },
      { value: "tourism" as Industry, label: "Turismo" },
      { value: "other" as Industry, label: "Altro" },
    ],
  },
  {
    title: "Fase",
    field: "phase" as const,
    options: [
      { value: "idea" as Phase, label: "Idea" },
      { value: "validation" as Phase, label: "Validazione" },
      { value: "mvp" as Phase, label: "MVP" },
      { value: "traction" as Phase, label: "Traction" },
      { value: "scaling" as Phase, label: "Scaling" },
    ],
  },
  {
    title: "Geografia",
    field: "geography" as const,
    options: [
      { value: "local" as Geography, label: "Locale" },
      { value: "national" as Geography, label: "Nazionale" },
      { value: "european" as Geography, label: "Europeo" },
      { value: "global" as Geography, label: "Globale" },
    ],
  },
  {
    title: "Modello di Business",
    field: "businessModel" as const,
    options: [
      { value: "b2b" as BusinessModel, label: "B2B" },
      { value: "b2c" as BusinessModel, label: "B2C" },
      { value: "b2b2c" as BusinessModel, label: "B2B2C" },
      { value: "subscription" as BusinessModel, label: "Subscription" },
      { value: "transaction" as BusinessModel, label: "Transaction" },
      { value: "freemium" as BusinessModel, label: "Freemium" },
      { value: "commission" as BusinessModel, label: "Commission" },
    ],
  },
];

export default function StartupWizard() {
  const { data, completed, isOpen, setField, complete, close } = useOnboardingStore();
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const current = steps[step];
  const value = data[current.field];

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      complete();
    }
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-purple-900">CanvasPilot Setup</h2>
          <button
            onClick={close}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            Skip for now
          </button>
        </div>

        <div className="flex gap-1 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-purple-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <h3 className="text-sm font-medium text-gray-500 mb-3">
          Step {step + 1} of {steps.length} — {current.title}
        </h3>

        <div className="grid grid-cols-2 gap-2 mb-8">
          {current.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setField(current.field, opt.value)}
              className={`px-4 py-3 rounded-xl border text-left text-sm font-medium transition-all ${
                value === opt.value
                  ? "border-purple-500 bg-purple-50 text-purple-700 shadow-sm"
                  : "border-gray-200 bg-white text-gray-700 hover:border-purple-200 hover:bg-purple-50/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={prev}
            disabled={step === 0}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-0"
          >
            Back
          </button>
          <button
            onClick={next}
            className="px-6 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            {step < steps.length - 1 ? "Next" : "Start Building"}
          </button>
        </div>
      </div>
    </div>
  );
}
