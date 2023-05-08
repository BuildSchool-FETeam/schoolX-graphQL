export enum DEFAULT_PERM {
  ROOT = 'C:*|R:*|U:*|D:*',
  READ_ONLY = 'C:x|R:*|U:x|D:x',
  UPDATE_SELF = 'C:+|R:*|U:+|D:+',
  DENINED = 'C:x|R:x|U:x|D:x',
}

export const REGEX_PERM = {
  READ: /R:[+|x|*]/,
  CREATE: /C:[+|x|*]/,
  UPDATE: /U:[+|x|*]/,
  DELETE: /D:[+|x|*]/,
}
