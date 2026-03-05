'use client'

import { useModeStore } from "@/stores/modeStore"

const ModeSelector = () => {

    const mode: string[] = ['Letters Only', "Letters + Numbers", "All Symbols"]
    const { selectedMode, setSelectedMode } = useModeStore();

    return (
        <div>
            <label className="text-sm font-medium text-gray-700">Complexity</label>
            <div className="flex gap-2">
                {
                    mode.map((option) => (
                        <button
                            key={option}
                            type="button"
                            className={`px-2 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap flex-1
                        ${selectedMode === option
                                    ? 'bg-blue-500 text-white shadow-md'
                                    : 'bg-white text-gray-700'}
                          hover:text-gray-900 hover:bg-gray-50 rounded-lg border
                          border-gray-200 shadow-sm`}
                            onClick={() => setSelectedMode(option)}
                        >
                            {option}
                        </button>
                    ))
                }
            </div>
        </div>
    )
}

export default ModeSelector