import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdirSync, cpSync } from 'node:fs'
import { execSync } from 'node:child_process'

const filename = fileURLToPath(import.meta.url)
const directory = dirname(filename)
/**
 * NPM workspaces does not appear to use `--install-strategy=nested`
 * correctly. There are still hoisted dependencies.
 * 
 * This moves the installed dependencies from the various node_module
 * locations into one directory for distribution.
 */
const build = (pkg) => {
  const rootDeps = resolve(directory, './node_modules')
  const rootDepPkg = resolve(directory, rootDeps, pkg)
  const pkgDeps = resolve(directory, `./packages/${pkg}/node_modules`)
  const output = resolve(`./dist/${pkg}`)

  execSync('npm run clean', { stdio: 'inherit' })
  execSync(`npm ci --install-strategy=nested --omit=dev --workspace=${pkg}`, { stdio: 'inherit' })
  execSync('rm -rf ./dist', { stdio: 'inherit' })
  mkdirSync(output, { recursive: true })
  cpSync(rootDeps, output, {recursive: true, filter: (src) => {
    // Skip the symlinked pkg directory created by npm workspaces
    if (src !== rootDepPkg) {
      return true
    }
  }})
  cpSync(pkgDeps, output, { recursive: true })
}

build(process.argv[2])
