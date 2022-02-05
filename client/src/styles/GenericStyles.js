import styled from "styled-components";

export const Button = styled.button`
width: 25%;
height: 35px;
padding: 2px;
font-size: 20px;
border-radius: 5px;
border: 2px solid black;

:hover {
    background: rgb(14, 56, 110);
    color: white;
}
`;

export const Container = styled.div`
    width: 100%;
    height: 100%;
    margin: 10px auto;
    justify-content: center;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const Image = styled.img`
    width: 250px;
    height: 100%;
`