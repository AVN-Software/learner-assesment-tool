// ============================================================================
// WizardComponent.tsx - Standalone wizard with built-in navigation
// ============================================================================
import React from 'react';
import { useWizard } from './useWizard';
import { WIZARD_CONFIG, STEPS, type StepKey } from '../components/wizard/wizard-config';
import { Check } from 'lucide-react';

interface WizardComponentProps {
  canProceed: (step: StepKey) => boolean;
  stepComponents: Record<StepKey, React.ComponentType>;
}

export const WizardComponent: React.FC<WizardComponentProps> = ({
  canProceed,
  stepComponents
}) => {
  const wizard = useWizard({
    steps: STEPS,
    initialStep: 'intro'
  });

  const currentStepConfig = WIZARD_CONFIG[wizard.currentStep];
  const StepContent = stepComponents[wizard.currentStep];
  const canNavigate = canProceed(wizard.currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 -z-10" />
            <div 
              className="absolute top-5 left-0 h-0.5 bg-blue-600 -z-10 transition-all duration-500"
              style={{ width: `${(wizard.stepIndex / (wizard.totalSteps - 1)) * 100}%` }}
            />
            
            {STEPS.map((step, index) => {
              const config = WIZARD_CONFIG[step];
              const Icon = config.icon;
              const isActive = index === wizard.stepIndex;
              const isCompleted = index < wizard.stepIndex;
              
              return (
                <div key={step} className="flex flex-col items-center relative z-10">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 shadow-sm
                      ${isActive 
                        ? 'bg-blue-600 text-white scale-110 shadow-lg ring-4 ring-blue-100' 
                        : isCompleted 
                          ? 'bg-green-500 text-white'
                          : 'bg-white text-slate-400 border-2 border-slate-200'
                      }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs mt-2 font-medium text-center max-w-[90px] transition-colors
                    ${isActive ? 'text-blue-600' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                    {config.meta.shortLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200/50">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <currentStepConfig.icon className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {currentStepConfig.title}
                </h1>
                <p className="text-blue-100 text-lg">
                  {currentStepConfig.description}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-8 py-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center justify-between text-sm font-medium text-slate-600 mb-3">
              <span>Step {wizard.stepIndex + 1} of {wizard.totalSteps}</span>
              <span className="text-blue-600">{wizard.progress}% Complete</span>
            </div>
            <div className="relative w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div 
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${wizard.progress}%` }}
              />
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
                style={{ width: `${wizard.progress}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="p-8 md:p-12 min-h-[400px]">
            <StepContent />
          </div>

          {/* Navigation */}
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
            <div className="flex-1">
              {currentStepConfig.showBackButton && (
                <button
                  onClick={wizard.goToPrevious}
                  disabled={!wizard.canGoPrevious}
                  className="px-6 py-2.5 bg-white border-2 border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-300 transition-all duration-200"
                >
                  ← Back
                </button>
              )}
            </div>
            
            <button
              onClick={wizard.goToNext}
              disabled={!wizard.canGoNext || !canNavigate}
              className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {currentStepConfig.primaryButton} →
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-slate-500">
          Need help? Contact support or view documentation
        </div>
      </div>
    </div>
  );
};

