exports.New = () => {
  return {
    db: {},

    insert(table, data) {
      if (!(table in this.db)) {
        this.db[table] = [];
      }
      this.db[table].push(data);
    },

    findAll(table, field, value) {
      rows = [];
      for (const row of this.db[table]) {
        for (const [rowName, rowValue] of Object.entries(row)) {
          if (rowName === field && rowValue === value) {
            rows.push(row);
          }
        }
      }
      return rows;
    },

    findOne(table, field, value) {
        rows = [];
        for (const row of this.db[table]) {
          for (const [rowName, rowValue] of Object.entries(row)) {
            if (rowName === field && rowValue === value) {
              return row
            }
          }
        }
      },

    printAll() {
      console.log(this.db);
    },
  };
};
