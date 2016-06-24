export class ScSampleData {
  // We simulate a database with named tables which contain records (objects)
  // returns a map whose keys are collection names and whose values are arrays of objects in those collections
  createTables() {
    let tables = [
      { id: 't1', name: 'Table 1' },
      { id: 't2', name: 'Table 2' },
    ];
    return {tables};
  }
}
