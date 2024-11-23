import { useState, useEffect } from 'react'

export function useTypewriter(text: string, speed: number = 50) {
  const [displayText, setDisplayText] = useState('')
  const [isTypingComplete, setIsTypingComplete] = useState(false)

  useEffect(() => {
    let i = 0
    const typingEffect = setInterval(() => {
      if (i < text.length) {
        setDisplayText((prev) => text.slice(0, i + 1))
        i++
      } else {
        clearInterval(typingEffect)
        setIsTypingComplete(true)
      }
    }, speed)

    return () => {
      clearInterval(typingEffect)
    }
  }, [text, speed])

  return { displayText, isTypingComplete }
}

