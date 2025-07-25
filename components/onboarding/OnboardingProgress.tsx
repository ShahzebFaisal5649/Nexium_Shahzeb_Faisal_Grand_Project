import { CheckCircle } from "lucide-react"

interface OnboardingProgressProps {
  currentStep: number
  totalSteps: number
  steps?: string[]
}

const defaultSteps = [
  "Welcome",
  "Upload Resume", 
  "Add Job Description",
  "View Results"
]

export function OnboardingProgress({ 
  currentStep, 
  totalSteps, 
  steps = defaultSteps 
}: OnboardingProgressProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </h3>
        <span className="text-sm text-muted-foreground">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </span>
      </div>
      
      <div className="w-full bg-muted rounded-full h-2 mb-6">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        {steps.slice(0, totalSteps).map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep

          return (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors
                ${isCompleted 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : isCurrent 
                    ? 'border-primary text-primary bg-background'
                    : 'border-muted-foreground/30 text-muted-foreground bg-background'
                }
              `}>
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{stepNumber}</span>
                )}
              </div>
              
              <span className={`
                text-xs text-center max-w-20 leading-tight
                ${isCurrent 
                  ? 'text-foreground font-medium' 
                  : 'text-muted-foreground'
                }
              `}>
                {step}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
