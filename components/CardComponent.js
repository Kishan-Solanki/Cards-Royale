"use client"

import Image from "next/image"

const CardComponent = ({ card, isVisible = true, size = "normal", imageErrors, onImageError }) => {
  const isMobile = window.innerWidth <= 768
  const sizeClasses = {
    normal: isMobile ? { width: 32, height: 45 } : { width: 56, height: 80 },
    large: isMobile ? { width: 36, height: 50 } : { width: 64, height: 88 },
    winner: { width: 40, height: 56 },
    small: isMobile ? { width: 24, height: 34 } : { width: 32, height: 48 },
  }

  const { width, height } = sizeClasses[size]

  if (!isVisible || card === "?" || !card) {
    return (
      <Image
        src="/cards/back.png"
        alt="Hidden card"
        width={width}
        height={height}
        className="object-cover rounded-md shadow-lg transition-all duration-300 flex-shrink-0"
        priority={size === "large"}
      />
    )
  }

  const cardSrc = `/cards/${card}.png`
  const shouldShowFallback = imageErrors && imageErrors.has(cardSrc)

  return (
    <Image
      src={shouldShowFallback ? "/cards/back.png" : cardSrc}
      alt={card}
      width={width}
      height={height}
      className="object-cover rounded-md shadow-lg transition-all duration-300 hover:scale-105 flex-shrink-0"
      onError={() => onImageError && onImageError(cardSrc)}
      priority={size === "large"}
    />
  )
}

export default CardComponent
