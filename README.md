# Deno Diary

CLI Diary tool

## Commands

### **`serve`**: Serve markdown files on a local server

Options:

- `-p`, `--port`: port to run the markdown server on

**8080 will be used if no port is specified.

Usage:

- find page by database id: `http://localhost:8080/id/{{id}}`
- find file by filename in the root directory:
  `http://localhost:8080/file/{{filename}}`

### **`read`**: Output a markdown file with the given id to the root directory

Options:

- `-i`, `--id` `[required]`: database id of the file to output

### **`create`**: Add markdown files to the database

Options:

- `-d`, `--dir`: Add all markdown files in the root directory to the database.
  `README.md` and files generated from `update` will be excluded.
- `-f`, `--file`: Add a markdown file in the root direcotry to the database.

**One of `--dir` or `--file` is required.

### **`list`**: List files in the database

- `-d`, `--date`: Only show files after this date.

### **`update`**: TODO