import { useState, useCallback } from 'react'

// Fraction definitions matching FRACTION_OPTIONS
export const FRACTION_OPTIONS = [
  { value: '0', label: '0"' },
  { value: '1', label: '1/16"' },
  { value: '2', label: '1/8"' },
  { value: '3', label: '3/16"' },
  { value: '4', label: '1/4"' },
  { value: '5', label: '5/16"' },
  { value: '6', label: '3/8"' },
  { value: '7', label: '7/16"' },
  { value: '8', label: '1/2"' },
  { value: '9', label: '9/16"' },
  { value: '10', label: '5/8"' },
  { value: '11', label: '11/16"' },
  { value: '12', label: '3/4"' },
  { value: '13', label: '13/16"' },
  { value: '14', label: '7/8"' },
  { value: '15', label: '15/16"' }
]

// Simplify fraction helper
export const getFractionDisplay = (sixteenths) => {
  const val = parseInt(sixteenths, 10) || 0
  if (val === 0) return ''
  const gcd = (a, b) => b ? gcd(b, a % b) : a
  const divisor = gcd(val, 16)
  return `${val / divisor}/${16 / divisor}`
}

// Formats a dual-mention string: "123.4 mm (4 ft 1 1/16 in / 49 1/16 in)"
export const formatDualDisplay = (mm) => {
  const parsedMm = parseFloat(mm) || 0
  if (parsedMm <= 0) return '0 mm (0")'
  const totalIn = parsedMm / 25.4
  const ft = Math.floor(totalIn / 12)
  const inch = Math.floor(totalIn % 12)
  let sixteenth = Math.round((totalIn - (ft * 12) - inch) * 16)
  
  let finalFt = ft
  let finalIn = inch
  if (sixteenth === 16) {
    sixteenth = 0
    finalIn += 1
  }
  if (finalIn === 12) {
    finalIn = 0
    finalFt += 1
  }

  const totalInFloor = Math.floor(totalIn)
  let totalSixteenth = Math.round((totalIn - totalInFloor) * 16)
  let finalTotalIn = totalInFloor
  if (totalSixteenth === 16) {
    totalSixteenth = 0
    finalTotalIn += 1
  }

  const fracDisp = getFractionDisplay(sixteenth)
  const totalInFracDisp = getFractionDisplay(totalSixteenth)

  const ftStr = finalFt > 0 ? `${finalFt} ft ` : ''
  const fracStr = fracDisp ? ` ${fracDisp}` : ''
  const totalFracStr = totalInFracDisp ? ` ${totalInFracDisp}` : ''

  return `${parsedMm.toFixed(1)} mm (${ftStr}${finalIn}${fracStr} in / ${finalTotalIn}${totalFracStr} in)`
}

// Formats a dual-mention string specifically for meters (m) to imperial conversion (used in slab length, etc.)
export const formatDualDisplayMeters = (meters) => {
  const parsedM = parseFloat(meters) || 0
  if (parsedM <= 0) return '0 m (0")'
  const mm = parsedM * 1000
  const totalIn = mm / 25.4
  const ft = Math.floor(totalIn / 12)
  const inch = Math.floor(totalIn % 12)
  let sixteenth = Math.round((totalIn - (ft * 12) - inch) * 16)
  
  let finalFt = ft
  let finalIn = inch
  if (sixteenth === 16) {
    sixteenth = 0
    finalIn += 1
  }
  if (finalIn === 12) {
    finalIn = 0
    finalFt += 1
  }

  const totalInFloor = Math.floor(totalIn)
  let totalSixteenth = Math.round((totalIn - totalInFloor) * 16)
  let finalTotalIn = totalInFloor
  if (totalSixteenth === 16) {
    totalSixteenth = 0
    finalTotalIn += 1
  }

  const fracDisp = getFractionDisplay(sixteenth)
  const totalInFracDisp = getFractionDisplay(totalSixteenth)

  const ftStr = finalFt > 0 ? `${finalFt} ft ` : ''
  const fracStr = fracDisp ? ` ${fracDisp}` : ''
  const totalFracStr = totalInFracDisp ? ` ${totalInFracDisp}` : ''

  return `${parsedM.toFixed(3)} m (${ftStr}${finalIn}${fracStr} in / ${finalTotalIn}${totalFracStr} in)`
}

export const convertMmToAll = (mm) => {
  const totalIn = mm / 25.4
  const ft = Math.floor(totalIn / 12)
  const inch = Math.floor(totalIn % 12)
  let sixteenth = Math.round((totalIn - (ft * 12) - inch) * 16)
  
  let finalFt = ft
  let finalIn = inch
  if (sixteenth === 16) {
    sixteenth = 0
    finalIn += 1
  }
  if (finalIn === 12) {
    finalIn = 0
    finalFt += 1
  }

  const totalInFloor = Math.floor(totalIn)
  let totalSixteenth = Math.round((totalIn - totalInFloor) * 16)
  let finalTotalIn = totalInFloor
  if (totalSixteenth === 16) {
    totalSixteenth = 0
    finalTotalIn += 1
  }

  return {
    mm: parseFloat(mm.toFixed(3)),
    m: parseFloat((mm / 1000).toFixed(6)),
    ft: finalFt,
    inch: finalIn,
    sixteenth: sixteenth,
    totalIn: finalTotalIn,
    totalSixteenth: totalSixteenth,
    fracDisplay: getFractionDisplay(sixteenth),
    totalInFracDisplay: getFractionDisplay(totalSixteenth)
  }
}

export const imperialToMm = (ft, inch, sixteenth) => {
  const totalIn = (parseFloat(ft) || 0) * 12 + (parseFloat(inch) || 0) + (parseFloat(sixteenth) || 0) / 16
  return totalIn * 25.4
}

export const totalInchesToMm = (totalIn, sixteenth) => {
  const totalInVal = (parseFloat(totalIn) || 0) + (parseFloat(sixteenth) || 0) / 16
  return totalInVal * 25.4
}

export function useUnitConverter(initialMm = 0) {
  const [mm, setMmState] = useState(initialMm)

  // Derive all other components from mm state
  const data = convertMmToAll(mm)

  const updateFromMm = useCallback((newMm) => {
    const val = Math.max(0, parseFloat(newMm) || 0)
    setMmState(val)
  }, [])

  const updateFromM = useCallback((newM) => {
    const val = Math.max(0, parseFloat(newM) || 0) * 1000
    setMmState(val)
  }, [])

  const updateFromFtDecimal = useCallback((newDecimalFt) => {
    const val = Math.max(0, parseFloat(newDecimalFt) || 0) * 12 * 25.4
    setMmState(val)
  }, [])

  const updateFromImperial = useCallback((ft, inch, sixteenth) => {
    const calculatedMm = imperialToMm(ft, inch, sixteenth)
    setMmState(calculatedMm)
  }, [])

  const updateFromTotalInches = useCallback((totalIn, sixteenth) => {
    const calculatedMm = totalInchesToMm(totalIn, sixteenth)
    setMmState(calculatedMm)
  }, [])

  return {
    mm,
    m: data.m,
    ftDecimal: (mm / 25.4) / 12,
    ft: data.ft,
    inch: data.inch,
    sixteenth: data.sixteenth,
    totalIn: data.totalIn,
    totalSixteenth: data.totalSixteenth,
    fracDisplay: data.fracDisplay,
    totalInFracDisplay: data.totalInFracDisplay,
    
    // Setters
    setMm: updateFromMm,
    setM: updateFromM,
    setFtDecimal: updateFromFtDecimal,
    setImperial: updateFromImperial,
    setTotalInches: updateFromTotalInches,

    // String Format helpers
    dualDisplay: formatDualDisplay(mm),
    dualDisplayMeters: formatDualDisplayMeters(data.m)
  }
}
