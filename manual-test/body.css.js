import styled from "../dist/styled.js";

const animations = ["fade-in", "fade-out"].map((name) => styled.css `
    & .${name} {
        animation-name: ${name};
    }
`);

export default styled.css `

    .animations {
        ${animations}
    }

`