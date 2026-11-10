import type { IconName } from './Icon'

/**
 * The six agents' look, in the crew's order (Front desk, Orders & returns, Tech support,
 * Billing, Researcher, Reviewer): the colour of each one's tile and the icon on it. Shared by
 * the home page's crew and the Agents page's "Who does what".
 */
export const AGENT_ACCENTS = ['#2a78d6', '#eb6834', '#0f9e9e', '#d6589a', '#6250d6', '#172033']

/** A headset, a parcel, a wrench, a card, a magnifier, a shield */
export const AGENT_ICONS: IconName[] = ['desk', 'orders', 'tech', 'billing', 'research', 'review']
