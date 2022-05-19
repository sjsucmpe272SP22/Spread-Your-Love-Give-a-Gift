import React from "react";
import { render, screen, fireEvent,act } from "@testing-library/react";
import Login from "../components/Login";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {rest} from 'msw';
import {setupServer} from 'msw/node';

const server = setupServer(
  rest.post('http://localhost:3001/api/login/', (req, res, ctx) => {
    const userData = req.body;
    console.log(userData);
    if(userData.email==="sriram4art@gmail.com" && userData.password==="Sriram@123"){
        console.log("Login successful");
        return res(ctx.json({loginSuccess: true}));
    }else{
        console.log("Login unsuccessful");
        return res(ctx.json({loginSuccess: false}));
    }
  }),
)

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());


test("testing login page", async () => {
  render(
    <React.StrictMode>
      <BrowserRouter>
          <Login />
      </BrowserRouter>
    </React.StrictMode>
  );

  const emailInput = screen.getByLabelText("Email");
  const passwordInput = screen.getByLabelText("Password");
  const loginButton = screen.getByText(/Login/i, { selector: "button" });
  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(loginButton).toBeInTheDocument();
    
  fireEvent.change(emailInput, {target:{value:"sriram4art@gmail.com"}});
  fireEvent.change(passwordInput, {target:{value:"Sriram@123"}});
  act(()=>{
    fireEvent(loginButton,new MouseEvent('click'));
  });
});