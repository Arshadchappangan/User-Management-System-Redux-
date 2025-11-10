import React from 'react'

const InputField = ({label,type,placeholder,svg_path}) => {
  return (
    <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-200"
          >
            {label}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={svg_path}
                />
              </svg>
            </div>
            <input
              type={type}
              id={type}
              name={type}
              placeholder={placeholder}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition duration-200"
            />
          </div>
        </div>
  )
}

export default InputField
