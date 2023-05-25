import { assert } from "./utils"
import { parse, valid } from "node-html-parser"

export const userHits: { [key: string]: number } = {} // global

export const analyzeTelegramHtml = (textRaw: string) => {
    assert(valid(textRaw), "Invalid HTML")

    const root = parse(textRaw) // parsed HTML object
    const nodes = root.querySelectorAll(".from_name")

    for (const node of nodes) {
        assert(node && node.childNodes && node.childNodes.length >= 1, "Invalid from_name node")

        const user = node.childNodes[0].rawText.trim()

        if (userHits[user] === undefined) userHits[user] = 0
        userHits[user] += 1
    }
}
