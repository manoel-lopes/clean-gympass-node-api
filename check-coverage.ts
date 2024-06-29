import fs from 'node:fs'
import { createCoverageMap } from 'istanbul-lib-coverage'

const COVERAGE_PERCENTAGE =
  process.env.COVERAGE_PERCENTAGE !== undefined
    ? Number(process.env.COVERAGE_PERCENTAGE)
    : 100
const content = fs.readFileSync('./coverage/coverage-final.json', 'utf-8')
const coverageMap = createCoverageMap(JSON.parse(content))
const allFilesCoverage = coverageMap.getCoverageSummary()

const totalCoverage =
  (allFilesCoverage.statements.pct +
    allFilesCoverage.branches.pct +
    allFilesCoverage.functions.pct +
    allFilesCoverage.lines.pct) /
  4

if (totalCoverage < COVERAGE_PERCENTAGE) {
  console.error(
    `\n\x1b[1m\x1b[31mX Coverage is below ${COVERAGE_PERCENTAGE}% (${totalCoverage.toFixed(
      2,
    )}%). Aborting push.\x1b[0m\n`,
  )
  process.exit(1)
}
