import styled from "../styled.js";

export default function() {


    const node = styled.less `
       body: {
          font-weight: bold;
       }
    `

    console.log(node.toStringWithSourceMap().map.toJSON());


}
