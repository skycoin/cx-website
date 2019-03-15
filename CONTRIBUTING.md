# Contributing to CX website

## Markdown content

Content of the CX website is generated from Markdown files.

These files are stored in [./src/assets/content](./src/assets/content) directory.

After you create a file, you can access it by going to `http://localhost:4200/<name of the file>`.
You can also create sub pages by moving the files into directories.

Content on the homepage is generated from file `home.md`.

**Examples:**

- Simple page
  - Create file `./src/assets/content/hello-world.md`
  - It is accessible from `http://localhost:4200/hello-world`
- Sub page
  - Create file `./src/assets/content/tutorial/hello-world.md`
  - It is accessible from `http://localhost:4200/tutorial/hello-world`

### Headers

You should always start a page with `h1 (#)` header which will act as a page title.
There will be auto-generated table-of-contents from `h2 (##)` and `h3 (###)` headers under it.

### Links

In case you want to manually reference a header, you have to use full path in the link.
For example, if you are on `/about` page and trying to create link to `About CX` header, you would write `[go to About CX](/about#cx)`.

#### Custom links

You can take it even further and create the targets in the text manually (when you need more precise place than just a header) by writing `<a name="name-of-the-anchor"></a>` directly into the markdown code.
Then, just reference it `[go to custom anchor](/page#name-of-the-anchor)`.

### Images

If you want to store an image in the project files, you can do so by placing it into [./src/assets/img](./src/assets/img) directory.
After that, you can reference it simply by writing its name `![example image](img.png)`. The full path will be automatically resolved.

### Code

The code should be always fenced by three backticks:

    ```
    str.print("Hello World!")
    ```

To enable syntax highlighting, add the language name after the backtics (only `cx` / `go` are supported):

    ```cx
    str.print("Hello World!")
    ```
