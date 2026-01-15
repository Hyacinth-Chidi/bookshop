/**
 * ============================================
 * INPUT COMPONENT
 * ============================================
 * Reusable input field with label and error handling
 */

export default function Input({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-neutral-900 mb-1"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`
          w-full px-4 py-2 rounded-lg border
          ${error ? 'border-error' : 'border-neutral-200'}
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          disabled:bg-neutral-100 disabled:cursor-not-allowed
          transition-smooth
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
}