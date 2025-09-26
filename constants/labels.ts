export const LABELS = {
  grind: {
    whole: "Granos Enteros",
    coarse: "Gruesa",
    medium: "Media",
    fine: "Fina",
    espresso: "Espresso",
    nespresso: "Nespresso",
  },
  presentation: {
    quarter: "1/4 kg",
    half: "1/2 kg",
    full: "1 kg",
  },
  presentationShort: {
    quarter: "1/4",
    half: "1/2",
    full: "1",
  },
} as const

export const PRESENTATION_MULTIPLIERS = {
  quarter: 1,
  half: 1.8,
  full: 3.5,
} as const

export const IVA_RATE = 0.21 // 21% IVA en Argentina

export const getGrindLabel = (grind: keyof typeof LABELS.grind) => LABELS.grind[grind]
export const getPresentationLabel = (presentation: keyof typeof LABELS.presentation) =>
  LABELS.presentation[presentation]
export const getPresentationMultiplier = (presentation: keyof typeof PRESENTATION_MULTIPLIERS) =>
  PRESENTATION_MULTIPLIERS[presentation]
