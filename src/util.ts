export function usePlugin(fileName: string) {
  return /(\.css|\.pcss)$/i.test(fileName);
}


export function createResultsId(fileName: string) {
  // create what the new path is post transform (.css)
  const pathParts = fileName.split('.');
  pathParts[pathParts.length - 1] = 'css';
  return pathParts.join('.');
}
