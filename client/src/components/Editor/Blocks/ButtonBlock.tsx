interface ButtonBlockProps {
  label?: string;
  url?: string;
  alignment?: 'left' | 'center' | 'right';
  variant?: 'primary' | 'secondary' | 'outline';
}

export const ButtonBlock = ({ label, url, alignment = 'center', variant = 'primary' }: ButtonBlockProps) => {
  const baseClasses = "inline-flex items-center justify-center px-8 py-4 font-semibold rounded-theme transition-all shadow-sm hover:shadow-md pointer-events-none";
  let variantClasses = "";
  
  if (variant === 'primary') {
    variantClasses = "bg-primary text-white hover:opacity-90";
  } else if (variant === 'secondary') {
    variantClasses = "bg-secondary text-white hover:opacity-90";
  } else {
    variantClasses = "border-2 border-gray-200 text-gray-900 hover:border-primary";
  }

  return (
    <div className={`w-full py-6 px-4 flex justify-${alignment === 'center' ? 'center' : alignment === 'right' ? 'end' : 'start'}`}>
      <button className={`${baseClasses} ${variantClasses}`}>
        {label || "Klick mich"}
      </button>
    </div>
  );
};
