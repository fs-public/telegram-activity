import { HIT_BRACKETS } from "./config"
import { assert } from "./utils"

/**
 * Gets bracket name by number of hits
 */
export const getBracket = (hits: number) => {
    assert(hits >= 1, "A zero hit which should never happen")

    for (let i = 0; i < HIT_BRACKETS.length; i++) {
        if (HIT_BRACKETS[i] >= hits) return i
    }

    return HIT_BRACKETS.length
}

/**
 * Gets bracket name by its index
 */
export const getBracketName = (bracket: number) => {
    assert(0 <= bracket && bracket <= HIT_BRACKETS.length)

    if (bracket === 0) return HIT_BRACKETS[0]

    if (bracket < HIT_BRACKETS.length) {
        const lower = HIT_BRACKETS[bracket - 1] + 1
        const upper = HIT_BRACKETS[bracket]
        return lower === upper ? lower : `${lower}-${upper}`
    }

    if (bracket === HIT_BRACKETS.length) return `${HIT_BRACKETS[bracket - 1] + 1}+`

    return "undefined"
}
