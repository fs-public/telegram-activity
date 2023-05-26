import { HIT_BRACKETS, MESSAGES_DIRECTORY } from "./config"
import { getAllFiles, readFile } from "./utils"
import { getBracket, getBracketName } from "./brackets"
import { analyzeConcurrently } from "./workers/manager"

const main = async () => {
    // Initialize /////////////////////////////////////////
    console.log("Telegram Activity Analysis")

    const contents = getAllFiles(MESSAGES_DIRECTORY).map((file) => readFile(file))

    console.log("All", contents.length, "files loaded.")

    // Analyze /////////////////////////////////////////

    const userHits = await analyzeConcurrently(contents)

    const users = Object.keys(userHits)

    console.log("All files parsed and users counted. Total unique users:", users.length)

    // Cumulative sums /////////////////////////////////////////

    const userCounts = [...Array(HIT_BRACKETS.length + 1)].fill(0)

    users.forEach((user) => userCounts[getBracket(userHits[user])]++)

    // Output as a nice table
    const userHitsWithKeys = Object.fromEntries(userCounts.map((hits, i) => [getBracketName(i), hits]))
    console.table(userHitsWithKeys)
}

main()
