const loader = require("../class-simplify-css-loader")
/**
 *        .a
 *        / \
 *      .b   .c
 *     /    /  \
 *   .d   .e    .f
 */
const testCssStr = `
  .a {
    color: blue;
  }
  .a .b {
    color: black;
  }
  .a .c {
    color: green;
  }
  .a .b .d {
    color: white;
  }
  .a .c .e {
    border: none;
  }
  .a .c .f {
    margin: 10px;
  }
`