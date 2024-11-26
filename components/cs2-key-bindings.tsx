import React from 'react'

type KeyBinding = {
  key: string
  command: string
}

type CS2KeyBindingsProps = {
  bindings: KeyBinding[]
}

const keyLayout = [
  ['Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  ['CapsLock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Win', 'Menu', 'Ctrl']
]

export function CS2KeyBindings({ bindings }: CS2KeyBindingsProps) {
  const getBindingForKey = (key: string) => {
    return bindings.find(binding => binding.key.toLowerCase() === key.toLowerCase())
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-xl font-bold mb-4 text-white">Keyboard Bindings</h3>
      <div className="grid gap-1">
        {keyLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 justify-center">
            {row.map((key) => {
              const binding = getBindingForKey(key)
              return (
                <div
                  key={key}
                  className={`
                    flex items-center justify-center
                    ${key === 'Space' ? 'col-span-4' : 'col-span-1'}
                    ${['Backspace', 'Enter', 'Shift', 'Ctrl', 'Alt', 'Win'].includes(key) ? 'col-span-2' : ''}
                    h-12 px-2 rounded bg-gray-800 border border-gray-700
                    ${binding ? 'bg-yellow-900 border-yellow-600' : ''}
                    text-xs font-medium
                  `}
                  style={{ minWidth: key === 'Space' ? '200px' : '40px' }}
                >
                  <span className="text-center">
                    {key}
                    {binding && (
                      <span className="block text-[10px] text-yellow-300 truncate max-w-[60px]" title={binding.command}>
                        {binding.command}
                      </span>
                    )}
                  </span>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

