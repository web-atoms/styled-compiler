import styled from "../dist/styled.js";

const animations = [["div", "yellow"], ["section", "green"]].map(([name, color]) =>
    styled.css `
        & ${name} {
            color: ${color};
        }
`);

export default styled.css `

    @import "./vars/vars.css.js";

    body {
        font-weight: 500;
        ${animations}
    }

`