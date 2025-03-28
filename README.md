# Styled-Compiler
Compiles Styled export to CSS at compile time

## Why?
Because other CSS processors are too complex, and some have unnecessary political alignments (which may become problematic in future due to change in their license or world politics). Some how LESS's syntax is very complicated when it comes to write simple foreach or conditional statements. Things like combing strings, replacing strings etc often leads to error due to limited editor support. Since VS Code provides excellent support for wiritng JavaScript, so it is easy to write many large LESS/CSS files easily broken down into many smaller JS files.

## So what does this do?
Compiles a simple JavaScript file that contains default `styled` css object into a CSS file with map file.

## Examples

animation.css-js
```js
import styled from "styled-compiler";

const durations = [0.1, 0.3, 0.7];

const duration = (v, i) => styled.css `
    & .animation-duration-${i}: {
        animation-duration: ${v}s;
    }
`;

export default styled.css `

    .animations {

        & span {
            ${durations
                .map(duration)}
        }
        & div {
            ${durations
                .map(duration)}
        }
    }

`;
```

Command: `styled-compiler animation.css-js animation.css`

This will generate following along with map.
animation.css
```css
.animations span .animation-duration-0 {
    animation-duration: 0.1s;
}
.animations span .animation-duration-1 {
    animation-duration: 0.3s;
}
.animations span .animation-duration-2 {
    animation-duration: 0.7s;
}
.animations div .animation-duration-0 {
    animation-duration: 0.1s;
}
.animations div .animation-duration-1 {
    animation-duration: 0.3s;
}
.animations div .animation-duration-2 {
    animation-duration: 0.7s;
}
```

Command: `styled-compiler animation.css-js animation.less`

This will generate following along.
animation.less

```less
.animations {
    & span {
        & .animation-duration-0 {
            animation-duration: 0.1s;
        }
        & .animation-duration-1 {
            animation-duration: 0.3s;
        }
        & .animation-duration-2 {
            animation-duration: 0.7s;
        }
    }
    & div {
        & .animation-duration-0 {
            animation-duration: 0.1s;
        }
        & .animation-duration-1 {
            animation-duration: 0.3s;
        }
        & .animation-duration-2 {
            animation-duration: 0.7s;
        }
    }
}
```


# So what is happening?

The compiler will convert given style objects into LESS file and internally will convert less into CSS.

# Stage - PLANNING
Currently the project is in planning stage.

## Preferred File Extensions
1. .lessx
2. .less-js
3. .css-js
4. .css.js
5. .less.js

## Features

### CSS Import
Doing CSS import or less import is an important feature, and we want to preserve the loader in such way that imports are not expanded in less file.

```javascript
import styled from "styled-compiler";

import relativeStyle from "./imported.less.js";

export default styled.css `
   @import (less) "${relativeStyle}";
`;

```

This will result in following less file,
```less

@import (less) "./imported.less";

```

