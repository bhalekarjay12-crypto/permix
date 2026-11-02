import { describe, expect, it } from 'vitest'
import {
  bitsToOctal,
  bitsToSymbol,
  parseOctalMode,
  parseSymbolicMode,
  getFullModeString,
  defaultGroups,
  defaultSpecialBits,
} from '../permissions'

describe('PermiX Linux Permission Tests', () => {

  it('converts read, write and execute bits to octal', () => {
    expect(bitsToOctal({
      read: true,
      write: true,
      execute: true,
    })).toBe(7)
  })

  it('converts permission bits to symbolic format', () => {
    expect(bitsToSymbol({
      read: true,
      write: false,
      execute: true,
    })).toBe('r-x')
  })

  it('parses standard octal permission 755', () => {
    const result = parseOctalMode('755')

    expect(result.valid).toBe(true)
    expect(result.octal).toBe('755')
    expect(result.permissions.owner).toEqual({
      read: true,
      write: true,
      execute: true,
    })
  })

  it('rejects invalid octal permissions', () => {
    expect(parseOctalMode('999').valid).toBe(false)
  })

  it('generates symbolic permissions for a file', () => {
    const result = getFullModeString(
      defaultGroups,
      defaultSpecialBits,
      'file',
    )

    expect(result).toBe('-rwxr-x---')
  })

  it('parses standard symbolic permissions', () => {
    const result = parseSymbolicMode('rwxr-xr-x')

    expect(result.valid).toBe(true)
    expect(result.permissions.owner).toEqual({
      read: true,
      write: true,
      execute: true,
    })
    expect(result.permissions.group).toEqual({
      read: true,
      write: false,
      execute: true,
    })
    expect(result.permissions.others).toEqual({
      read: true,
      write: false,
      execute: true,
    })
  })

  it('parses special symbolic permissions', () => {
    const result = parseSymbolicMode('-rwsr-xr-x')

    expect(result.valid).toBe(true)
    expect(result.special.setuid).toBe(true)
  })

})
