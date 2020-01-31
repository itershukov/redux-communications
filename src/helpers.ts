import { EActionsTypes } from './enums';

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.substring(1);
}

export function formatMethodName(s: string): string {
  if (s.includes('_')) {
    let result = s.toLowerCase();
    const matches = result.match(/(_\w)/g);

    if (!matches) {
      return result.toLowerCase();
    }

    for (const match of matches) {
      result = result.replace(match, match.toUpperCase());
    }

    return result.replace(/_/g, '');
  } else {
    const condition = s.split('').reduce((prev, next) => prev && next.toUpperCase() === next, true);

    if (condition) {
      return s.toLowerCase();
    } else {
      return s.charAt(0).toLowerCase() + s.substring(1);
    }
  }
}

export function getTypePrefix(namespace: string, branchName: string, type: string): string {
  return `${namespace.toUpperCase()}_${branchName.toUpperCase()}_${type.toUpperCase()}`;
}

export function getStartType(namespace: string, branchName: string, type: string): string {
  const typePrefix = getTypePrefix(namespace, branchName, type);
  return `${typePrefix}_TRY`;
}

export function getSuccessType(namespace: string, branchName: string, type: string): string {
  const typePrefix = getTypePrefix(namespace, branchName, type);
  return `${typePrefix}_SUCCESS`;
}

export function getFailType(namespace: string, branchName: string, type: string): string {
  const typePrefix = getTypePrefix(namespace, branchName, type);
  return `${typePrefix}_FAIL`;
}

export function getActionMethodName(namespace: string, branchName: string, type: string): string {
  return `${formatMethodName(type)}${capitalize(namespace)}${capitalize(branchName)}`;
}

export function getStateBranchName(namespace: string, branchName: string) {
  return `${namespace}${capitalize(branchName)}`;
}

export function getAPIMethodName(namespace: string, branchName: string, method: string): string {
  let type = method;

  switch (method.toUpperCase()) {
    case 'POST':
      type = EActionsTypes.add;
      break;
    case 'GET':
      type = EActionsTypes.get;
      break;
    case 'PUT':
      type = EActionsTypes.update;
      break;
    case 'DELETE':
      type = EActionsTypes.delete;
      break;
  }

  return getActionMethodName(namespace, branchName, type);
}
