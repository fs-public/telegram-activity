import { HIT_BRACKETS } from "./config"
import { assert } from "./utils"

export const getBracket = (hits: number) => {
    assert(hits >= 1, "A zero hit")

    for (let i = 0; i < HIT_BRACKETS.length; i++) {
        if (HIT_BRACKETS[i] >= hits) return i
    }

    return HIT_BRACKETS.length
}

export const getBracketName = (bracket: number) => {
    assert(0 <= bracket && bracket <= HIT_BRACKETS.length)

    if (bracket === 0) {
        return "1"
    } else if (bracket < HIT_BRACKETS.length) {
        const lower = HIT_BRACKETS[bracket - 1] + 1
        const upper = HIT_BRACKETS[bracket]
        return lower === upper ? lower : `${lower}-${upper}`
    } else if (bracket === HIT_BRACKETS.length) {
        const lower = HIT_BRACKETS[bracket - 1] + 1
        return lower + "+"
    }

    return "undefined"
}
