import styled from "styled-components";

export const Form = styled.form`
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    margin: auto;
    @media (max-width: 430px) {
        width: 90%
      }
`;

export const FormField = styled.input`
    width: 100%;
    height: 40px;
    border-radius: 2px;
    padding: 5px;
`;

export const Label = styled.label`
	margin-bottom: 5px;
	color: black;
    font-weight: 900;
    display: block;
`;

export const FormGroup = styled.div`
    display: block;
	width: 100%;
	margin: 20px auto;
`;

