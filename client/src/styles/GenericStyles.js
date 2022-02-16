import styled from "styled-components";

export const Button = styled.button`
width: 25%;
height: auto;
padding: 10px;
font-size: 20px;
margin: 5px;
border-radius: 5px;
border: 2px solid black;

:hover {
    background: rgb(14, 56, 110);
    color: white;
}
@media (max-width: 500px) {
    width: 50%;
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

export const Positive = styled.span`
    color: green;
`;

export const Negative = styled.span`
    color: red;
`;

export const ResultsContainer = styled.div`
    flex-direction: row;
    width: 70%;
    height: auto;
    margin: 30px auto;
    padding: 10px;
    justify-content: center;
    display: flex;
    align-items: center;
    border-bottom: black solid 1px;

    @media (max-width: 800px) {
        flex-direction: column;
        justify-content: center;
        width: 90%;
      }
`;

export const TextBlock = styled.div`
    padding: 10px;
    justify-content: center;
    align-items: center;
`;

export const ListBlock = styled.div`
    padding: 10px;
    justify-content: center;
    align-items: center;
`;

export const ListText = styled.p`
    font-weight: 700;
    font-size: 20px;
`;

export const ImageBlock = styled.div`
    padding: 10px;
    
`;

export const Image = styled.img`
    width: 250px;
    height: 100%;
`