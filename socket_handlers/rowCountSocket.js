const rowCountSocket = (socket, db) => {
  socket.on('rowCount', table => {
    // Note: I tried to make the below line a parameterized query but it kept erroring out despite my using the exact same format that worked in getScore and getAvatar. I am writing this off as a one-off for now, since we aren't actually using this query. All future queries will be parameterized.
    db.query(`SELECT COUNT(*) FROM ${table};`)
    .then(data => {
      const rowCount = data.rows[0].count;
      console.log(`[Data Flow Test #1:] # of rows in ${table} table: ${rowCount}`);
      socket.emit('rowCountReturn', `${rowCount} rows`);
    })
    .catch(error => {
      console.error(`[Data Flow Test #1:] "${table}" is not a valid table`);
      socket.emit('rowCountReturn', `"${table}" is not a valid table.`);
    });
  });
}

module.exports = { rowCountSocket };
