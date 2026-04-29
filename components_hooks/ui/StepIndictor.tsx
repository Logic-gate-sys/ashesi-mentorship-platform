export function StepIndicator({ current, totalSteps }: { current: number; totalSteps: number }) {
  const steps = ['Personal', 'Profile', 'Security', 'Interests', 'Connect', 'Legal']
  
  return (
    <div className="mb-10">
      {/* Step progress bar */}
      <div className="flex items-center gap-2 mb-6">
        {steps.map((label, i) => {
          const stepNum = i + 1
          const isActive = stepNum === current
          const isCompleted = stepNum < current
          
          return (
            <div key={stepNum} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-body text-[12px] font-bold transition-all duration-200 shrink-0
                ${isActive ? 'bg-brand text-white shadow-lg scale-110'  : isCompleted ? 'bg-red-800 text-white': 'bg-border text-text-muted' }`}>
                {isCompleted ? '✓' : stepNum}
              </div>
              
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className={`h-1 flex-1 mx-2 transition-colors duration-200 ${isCompleted ? 'bg-red-950' : 'bg-border'}`} />
              )}
            </div>
          )
        })}
      </div>
      
      {/* Step labels */}
      <div className="flex justify-between text-[12px] font-medium text-text-muted">
        {steps.map((label, i) => (
          <span key={i} className={current === i + 1 ? 'text-brand font-semibold' : ''}>
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}