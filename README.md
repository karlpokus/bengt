# bengt
A data wrangelig utility. A pretty stable work in progress.

# api
`File` is required `.csv`, concatenation is default. Separate columns by `,` and multiple inputs by `;`

## options

### GroupBy
`col`
A column to group all other values by.

### Skip
`col [, col]`
Skip all these columns.

### Unique
`col [, col]`
Concatenate *unique values* from column.

### Filter
`target, filter [, filter] [; target, filter [, filter]]`
Filter target column by one or more of the following:
- `max(col)`. Only cells with valid dates `YYYY-MM-DD` will be included.
- Standard comparison operators like `column>value`, `=`, `!=`, `>=` or regex `column/regex/`.

### Export to file
Check to download a `.csv` of the results. Works in modern browsers such as IE 10+. See more [here](https://github.com/eligrey/FileSaver.js/). Otherwise logs results.

# demo
[demo](http://s.codepen.io/KarlPokus/debug/7a796f207bb216bfeb286bdc2337dab0)

# Resources
- [Create excel file from node](http://stackoverflow.com/questions/17450412/how-to-create-an-excel-file-with-nodejs)
- [Download file from node without saving it first](http://expressjs.com/en/api.html#res.attachment)
- [csv Parse lib for node](http://csv.adaltas.com/parse/)
- [Create file in browser](http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server)

# Todos
- [ ] add proper tests for fat client with [BabyParse](https://github.com/Rich-Harris/BabyParse)
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
- [ ] option to export to {}

# License
MIT
