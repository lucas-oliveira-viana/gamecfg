import React from 'react'

type MouseBinding = {
  button: string
  command: string
}

type CS2MouseBindingsProps = {
  bindings: MouseBinding[]
}

export function CS2MouseBindings({ bindings }: CS2MouseBindingsProps) {
  const getBindingForButton = (button: string) => {
    return bindings.find(binding => binding.button.toLowerCase() === button.toLowerCase())
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4 text-white">Mouse Bindings</h3>
      <div className="relative w-64 h-96 mx-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 416.031 416.031"
          className="w-full h-full"
        >
          <path
            d="M221.605,0h-31.913C123.743,0,72.083,53.745,72.083,122.356v171.306c0,68.618,51.66,122.369,117.609,122.369h31.913  c67.46,0,122.343-54.894,122.343-122.369V122.356C343.948,54.889,289.065,0,221.605,0z M206.781,64.12h2.469c3.859,0,7,3.14,7,7  v49.833c0,3.86-3.141,7-7,7h-2.469c-3.859,0-7-3.14-7-7V71.12C199.781,67.26,202.922,64.12,206.781,64.12z M327.948,293.662  c0,58.652-47.705,106.369-106.343,106.369h-31.913c-56.978,0-101.609-46.723-101.609-106.369V122.356  C88.083,62.718,132.715,16,189.692,16h10.225v33.167c-9.34,2.927-16.136,11.661-16.136,21.954v49.833  c0,10.292,6.796,19.027,16.136,21.953v41.166c0,4.418,3.582,8,8,8s8-3.582,8-8v-41.108c9.441-2.865,16.333-11.647,16.333-22.011  V71.12c0-10.364-6.892-19.146-16.333-22.012V16h5.688c58.638,0,106.343,47.711,106.343,106.356V293.662z"
            fill="#4a4a4a"
          />
        </svg>

        {/* Left click */}
        <div 
          className="absolute top-[15%] left-[25%] w-[25%] h-[20%] rounded-tl-full"
          style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 30% 100%, 0 80%)'}}
        >
          {getBindingForButton('mouse1') ? (
            <span className="absolute top-[20px] left-1 text-[10px] text-yellow-300 font-bold truncate max-w-[80px]" title={getBindingForButton('mouse1')?.command}>
              {getBindingForButton('mouse1')?.command}
            </span>
          ) : (
            <span className="absolute top-[20px] left-1 text-[10px] text-white font-bold">MOUSE1</span>
          )}
        </div>

        {/* Right click */}
        <div 
          className="absolute top-[15%] right-[25%] w-[25%] h-[20%] rounded-tr-full"
          style={{clipPath: 'polygon(0 0, 100% 0, 100% 80%, 70% 100%, 0 100%)'}}
        >
          {getBindingForButton('mouse2') ? (
            <span className="absolute top-[20px] right-1 text-[10px] text-yellow-300 font-bold truncate max-w-[80px] text-right" title={getBindingForButton('mouse2')?.command}>
              {getBindingForButton('mouse2')?.command}
            </span>
          ) : (
            <span className="absolute top-[20px] right-1 text-[10px] text-white font-bold">MOUSE2</span>
          )}
        </div>

        {/* Middle click */}
        <div 
          className="absolute top-[20%] left-[45%] w-[10%] h-[10%] rounded-full"
        >
          {getBindingForButton('mouse3') ? (
            <span className="absolute bottom-[-15px] left-1/2 transform -translate-x-1/2
text-[10px] text-yellow-300 font-bold whitespace-nowrap truncate max-w-[80px]" title={getBindingForButton('mouse3')?.command}>
              {getBindingForButton('mouse3')?.command}
            </span>
          ) : (
            <span className="absolute bottom-[-15px] left-1/2 transform -translate-x-1/2 text-[10px] text-white font-bold whitespace-nowrap">MOUSE3</span>
          )}
        </div>

        {/* Mouse4 */}
        <div 
          className="absolute top-[40%] left-[10%] w-[15%] h-[10%] rounded-l-full"
        >
          {getBindingForButton('mouse4') ? (
            <span className="absolute top-1/2 left-[-60px] text-[10px] text-yellow-300 font-bold truncate max-w-[60px] transform -translate-y-1/2" title={getBindingForButton('mouse4')?.command}>
              {getBindingForButton('mouse4')?.command}
            </span>
          ) : (
            <span className="absolute top-1/2 left-[-60px] text-[10px] text-white font-bold transform -translate-y-1/2">MOUSE4</span>
          )}
        </div>

        {/* Mouse5 */}
        <div 
          className="absolute top-[55%] left-[10%] w-[15%] h-[10%] rounded-l-full"
        >
          {getBindingForButton('mouse5') ? (
            <span className="absolute top-1/2 left-[-60px] text-[10px] text-yellow-300 font-bold truncate max-w-[60px] transform -translate-y-1/2" title={getBindingForButton('mouse5')?.command}>
              {getBindingForButton('mouse5')?.command}
            </span>
          ) : (
            <span className="absolute top-1/2 left-[-60px] text-[10px] text-white font-bold transform -translate-y-1/2">MOUSE5</span>
          )}
        </div>
      </div>
    </div>
  )
}

