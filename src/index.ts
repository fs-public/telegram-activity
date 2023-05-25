import { HIT_BRACKETS, MESSAGES_DIRECTORY } from "./config"
import { assert, getAllFiles, readFile } from "./utils"
import { parse, valid } from "node-html-parser"
import { getBracket, getBracketName } from "./brackets"

const userHits: { [key: string]: number } = {} // global

const analyzeTelegramHtml = (textRaw: string) => {
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

const main = async () => {
    // Initialize /////////////////////////////////////////
    console.log("Telegram Activity Analysis")

    const files = getAllFiles(MESSAGES_DIRECTORY)

    const contents = files.map(file => readFile(file))

    console.log("All", files.length, "files loaded.")

    // Analyze /////////////////////////////////////////
    for (let i = 0; i < contents.length; i++) {
        console.log("Analyzing", files[i])
        analyzeTelegramHtml(contents[i])
    }

    const users = Object.keys(userHits)

    console.log("All files parsed and users counted. Total unique users:", users.length)

    // Cumulative sums /////////////////////////////////////////

    const userCounts = [...Array(HIT_BRACKETS.length + 1)].fill(0)

    users.forEach(user => userCounts[getBracket(userHits[user])]++)

    // Output as a nice table
    const userHitsWithKeys = Object.fromEntries(userCounts.map((hits, i) => [getBracketName(i), hits]))
    console.table(userHitsWithKeys)
}

main()
