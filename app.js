const express = require('express')
const app = express()
const cors = require('cors')
const sql = require('mssql')

app.use(express.json());
app.use(cors())
app.options('*', cors())

const config = {
  user: 'satyam',
  password: 'satyam',
  server: 'DESKTOP-ICV9A0G\\SQLEXPRESS', 
  database: 'CountriesAndCapitals'
};


//--------------------GET--------------------------

app.get('/api', (req, res) => { 
  
  __query = 'SELECT * from Countries';

  if(req.query.Country && req.query.Capital){
    __query += " WHERE Country = '" + req.query.Country + "' " + "OR Capital ='" + req.query.Capital + "'";
  }
  else if(req.query.Country || req.query.Capital){
    if(req.query.Country)
      __query += " WHERE Country = '" + req.query.Country + "'";
    if(req.query.Capital)
      __query += " WHERE Capital = '" + req.query.Capital + "' ";
  }
  sql.connect(config).then(() => {
    return sql.query(__query)
  }).then(result => {
    if(result.recordset.length == 0)
      res.status(404).send('Invalid country or capital name')
    else
    res.send(result.recordset)
    sql.close() 
  }).catch(err => {
    res.send(err)
    sql.close()
  }) 
})

app.get('/api/Countries', (req, res) => {
  __query = 'SELECT Country from Countries';

  sql.connect(config).then(() => {
    return sql.query(__query)
  }).then(result => {
    if(result.recordset.length == 0)
      res.status(404).send('No counntry found')
    else
    res.send(result.recordset)
    sql.close()  
  }).catch(err => {
    console.error(err)
    res.send(err)
    sql.close()
  })
  
})

app.get('/api/Capitals', (req, res) => {
  __query = 'SELECT Capital from Countries';
  sql.connect(config).then(() => {
    return sql.query(__query)
  }).then(result => {
    if(result.recordset.length == 0)
      res.status(404).send('No capital found')
    else
    res.send(result.recordset)
    sql.close()  
  }).catch(err => {
    console.error(err)
    res.send(err)
    sql.close()
  })
})

app.get('/api/:id', (req, res) => {
  __query = "SELECT * from Countries WHERE id = " + req.params.id ;
  sql.connect(config).then(() => {
    return sql.query(__query)
  }).then(result => {
    if(result.recordset.length == 0)
      res.status(404).send('Invalid ID')
    else
    res.send(result.recordset)
    sql.close()  
  }).catch(err => {
    console.error(err)
    res.send(err)
    sql.close()
  })
})


//--------------------POST--------------------------

app.post('/api', (req, res) => {
  __query = "INSERT INTO Countries (Country, Capital) VALUES ( '" + req.body.Country + "' , '" + req.body.Capital + "')";
  
  sql.connect(config).then(() => {
    return sql.query(__query)
  }).then(result => {
    if(result.rowsAffected[0] == 1)
      res.status(200).send('Successfully Added')
    else
      res.send("Can't add the country")
    sql.close() 
  }).catch(err => {
    console.error(err)
    res.send(err)
    sql.close()
  })
})

//--------------------DELETE--------------------------
app.delete('/api/:object', (req, res) => {
  __query = "DELETE FROM Countries WHERE Country = '" + req.params.object + "' OR Capital = '" + req.params.object + "'";
  
  sql.connect(config).then(() => {
    return sql.query(__query)
  }).then(result => {
    if(result.rowsAffected[0] >= 1)
      res.status(200).send('Successfully Deleted')
    else
      res.send('The Country you are trying to delete is not present')
    sql.close() 
  }).catch(err => {
    console.error(err)
    res.send(err)
    sql.close()
  })
})

//--------------------PUT--------------------------
app.put('/api/:id', (req, res) => {
  __query = "UPDATE Countries SET Country = '" + req.body.Country + "', Capital = '" + req.body.Capital + "' WHERE id = " + req.params.id;
  
  sql.connect(config).then(() => {
    return sql.query(__query)
  }).then(result => {
    console.log(result)
    if(result.rowsAffected[0] == 1)
      res.status(200).send('Successfully Updated')
    else
      res.send('The Country you are trying to update is not present')
    sql.close() 
  }).catch(err => {
    console.error(err)
    res.send(err)
    sql.close()
  })
})

app.listen(3000, () => console.log('Listening on port 3000'));