// Typed access to the live vignettes' content. Assigning the JSON to VignetteContent here means a
// missing or misspelt field fails the build instead of breaking an animation in the browser.
import vignettesJson from './vignettes.json'
import type { VignetteContent } from './vignettes.types'

export const vignettes: VignetteContent = vignettesJson

export type * from './vignettes.types'
