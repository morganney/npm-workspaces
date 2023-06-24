import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdirSync, copyFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

const filename = fileURLToPath(import.meta.url)
const directory = dirname(filename)
/**
 * 
 * NPM workspaces does not appear to use `--install-strategy=nested`
 * correctly. There are still hoisted dependencies.
 * 
 * This script effectively removes the workspace hierarchy and bypasses
 * npm --workspace tooling when producing a production artificat of a
 * workspace's dependencies.
 */
const prepare = (pkg) => {
  const lockfile = resolve(directory, './package-lock.json')
  const packageJson = resolve(directory, `./packages/${pkg}/package.json`)
  const output = resolve(`./dist/${pkg}`)

  execSync('npm run clean', { stdio: 'inherit' })
  execSync('rm -rf ./dist', { stdio: 'inherit' })
  mkdirSync(output, { recursive: true })
  copyFileSync(lockfile, resolve(output, './package-lock.json'))
  copyFileSync(packageJson, resolve(output, './package.json'))
  /**
   * Rerun `npm install` to get the package.json and package-lock.json
   * files in sync before running `npm ci`.
   */
  execSync('npm i --omit-dev', { cwd: output, stdio: 'inherit' })
  execSync('npm ci --omit=dev', { cwd: output, stdio: 'inherit' })
}

prepare(process.argv[2])
