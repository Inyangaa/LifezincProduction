interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = false, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-24 h-24 sm:w-28 sm:h-28',
    md: 'w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48',
    lg: 'w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg className={`${sizeClasses[size]}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="20" r="12" fill="#1AB0A8"/>
        <circle cx="82" cy="58" r="12" fill="#76E5D3"/>
        <circle cx="18" cy="58" r="12" fill="#224B9B"/>
        <path d="M50 20 L82 58 L18 58 Z" fill="none" stroke="#1AB0A8" strokeWidth="6" opacity="0.25"/>
      </svg>
      {showText && (
        <div className="mt-2 text-center">
          <h1 className="text-2xl font-bold text-gray-900">LifeZinc</h1>
          <p className="text-sm text-gray-600">Essential Nourishment for Mental Wellness</p>
        </div>
      )}
    </div>
  );
}
