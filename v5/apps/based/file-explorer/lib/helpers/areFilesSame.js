
// Helper function to compare two arrays of files
export default function areFilesSame(oldFiles, newFiles) {

  const oldSet = new Set(oldFiles.map(file => file)); // Assuming each file has a unique 'id'
  const newSet = new Set(newFiles.map(file => file));

  if (oldSet.size !== newSet.size) {
    return false;
  }

  for (let id of newSet) {
    if (!oldSet.has(id)) {
      return false;
    }
  }

  return true;
}