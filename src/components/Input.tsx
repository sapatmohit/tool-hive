/**
 * Input.jsx — Global form input component.
 * SINGLE SOURCE OF TRUTH: never recreate in modules.
 */

"use client";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
    label?: string;
    id: string;
    error?: string;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
}

export default function Input({
    label,
    id,
    type = "text",
    placeholder = "",
    value,
    onChange,
    error = "",
    required = false,
    disabled = false,
    prefix,
    suffix,
    className = "",
    ...rest
}: InputProps) {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label
                    htmlFor={id}
                    className="text-sm font-semibold text-gray-700"
                >
                    {label}
                    {required && <span className="text-[#FF385C] ml-1">*</span>}
                </label>
            )}
            <div className="relative flex items-center">
                {prefix && (
                    <span className="absolute left-3 text-gray-400 text-sm select-none">
                        {prefix}
                    </span>
                )}
                <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                    {...rest}
                    className={[
                        "w-full rounded-xl border bg-white text-gray-900 text-sm",
                        "px-4 py-3 outline-none transition-all duration-200",
                        "placeholder:text-gray-400",
                        prefix ? "pl-9" : "",
                        suffix ? "pr-9" : "",
                        error
                            ? "border-red-400 focus:ring-2 focus:ring-red-200"
                            : "border-gray-200 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20",
                        disabled ? "bg-gray-50 cursor-not-allowed opacity-60" : "",
                    ].join(" ")}
                />
                {suffix && (
                    <span className="absolute right-3 text-gray-400 text-sm select-none">
                        {suffix}
                    </span>
                )}
            </div>
            {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
        </div>
    );
}
