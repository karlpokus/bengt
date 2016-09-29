# bengt
A data wrangelig utility. A pretty stable work in progress.

# api
`File` is required. Concatenation is default. Separate columns by `,` and multiple inputs by `;`

## options

`GroupBy` A column to group all other values by.

`Skip` Skip all these columns. Separate multiple by `,`

`Unique` Concatenate unique values from column.

`Filter` Filter column by max(`column`) or use standard comparison operators `column>value`, `=`, `!=` or even regex `column/regex/`

# demo
[demo](http://s.codepen.io/KarlPokus/debug/7a796f207bb216bfeb286bdc2337dab0)

# Resources
- [Create excel file from node](http://stackoverflow.com/questions/17450412/how-to-create-an-excel-file-with-nodejs)
- [Download file from node without saving it first](http://expressjs.com/en/api.html#res.attachment)
- [csv Parse lib for node](http://csv.adaltas.com/parse/)
- [Create file in browser](http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server)

# Todos
- [ ] add proper tests for fat client
- [ ] check safe headernames
- [x] check valid dates
- [ ] validate input
- [ ] use papa parse error report
- [x] option: uniq
- [x] export csv from BO - Pass!
- [x] remove empty cells
- [ ] min
- [ ] count
- [x] implement sqls WHERE

# License
MIT