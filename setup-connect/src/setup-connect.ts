import { URL } from 'url'
import * as core from '@actions/core'

class ActionArgs {
  public apiKey: string = ''
  public rsconnectPythonVersion: string = ''
  public serverName: string = ''
  public url: string = ''
}

export async function setupConnect (args: ActionArgs): Promise<void> {
  // TODO: install rsconnect-python at specified version into tool
  // cache
}

export function loadArgs (): ActionArgs {
  const rawURL = core.getInput('url', { required: true })
  const rsconnectPythonVersion = core.getInput('rsconnect-python-version')
  const serverName = core.getInput('server-name')

  let apiKey = core.getInput('api-key')
  const apiKeySpecified = apiKey !== ''

  const url = new URL(rawURL)
  if (url.password !== '') {
    if (apiKeySpecified) {
      core.warning('using api key from URL password instead of api-key input')
    }
    apiKey = url.password
  } else if (url.username !== '') {
    if (apiKeySpecified) {
      core.warning('using api key from URL username instead of api-key input')
    }
    apiKey = url.username
  }
  url.password = ''
  url.username = ''

  const args = new ActionArgs()

  args.apiKey = apiKey
  args.url = url.toString()
  args.rsconnectPythonVersion = rsconnectPythonVersion ?? 'latest'
  args.serverName = serverName ?? 'default'

  return args
}
