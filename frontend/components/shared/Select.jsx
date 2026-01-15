'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function Select({
    label,
    name,
    value,
    onChange,
    options = [],
    placeholder = 'Select an option',
    required = false,
    disabled = false,
    error = null,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
    const containerRef = useRef(null);
    const dropdownRef = useRef(null);

    // Find selected option label
    const selectedOption = options.find(opt => opt.value === value);

    // Handle outside clicks and scroll
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        const handleScroll = (event) => {
            // Don't close if scrolling inside the dropdown
            if (dropdownRef.current && dropdownRef.current.contains(event.target)) {
                return;
            }
            if (isOpen) setIsOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('scroll', handleScroll, true);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen]);

    const handleToggle = () => {
        if (disabled) return;

        if (!isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const dropdownHeight = Math.min(options.length * 40, 200);

            setPosition({
                top: spaceBelow < dropdownHeight ? rect.top - dropdownHeight - 4 : rect.bottom + 4,
                left: rect.left,
                width: rect.width,
            });
        }
        setIsOpen(!isOpen);
    };

    const handleSelect = (optionValue) => {
        onChange({ target: { name, value: optionValue } });
        setIsOpen(false);
    };

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-neutral-900 mb-1.5 sm:mb-2">
                    {label} {required && <span className="text-error">*</span>}
                </label>
            )}

            {/* Select Button */}
            <div ref={containerRef} className="relative">
                <button
                    type="button"
                    onClick={handleToggle}
                    disabled={disabled}
                    className={`
            w-full px-3 sm:px-4 py-2 text-sm text-left rounded-lg border 
            focus:outline-none focus:ring-2 focus:ring-primary
            flex items-center justify-between gap-2
            transition-colors
            ${disabled
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-neutral-200'
                            : 'bg-white cursor-pointer border-neutral-200 hover:border-neutral-300'
                        }
            ${error ? 'border-error focus:ring-error' : ''}
            ${isOpen ? 'ring-2 ring-primary border-primary' : ''}
          `}
                >
                    <span className={`block truncate ${selectedOption ? 'text-neutral-900' : 'text-neutral-500'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown
                        className={`w-4 h-4 text-neutral-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {/* Hidden input for form validation */}
                {required && (
                    <input
                        type="text"
                        name={name}
                        value={value}
                        required={required}
                        onChange={() => { }}
                        className="sr-only"
                        tabIndex={-1}
                    />
                )}
            </div>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)} />

                    {/* Options */}
                    <div
                        ref={dropdownRef}
                        className="fixed z-[101] bg-white rounded-lg shadow-lg border border-neutral-200 py-1 max-h-[200px] overflow-y-auto"
                        style={{
                            top: position.top,
                            left: position.left,
                            width: position.width,
                        }}
                    >
                        {options.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-neutral-500">No options available</div>
                        ) : (
                            options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleSelect(option.value)}
                                    className={`
                    w-full px-3 py-2 text-sm text-left flex items-center justify-between gap-2
                    transition-colors
                    ${option.value === value
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-neutral-700 hover:bg-neutral-50'
                                        }
                  `}
                                >
                                    <span className="truncate">{option.label}</span>
                                    {option.value === value && (
                                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </>
            )}

            {/* Error Message */}
            {error && (
                <p className="mt-1 text-sm text-error">{error}</p>
            )}
        </div>
    );
}
