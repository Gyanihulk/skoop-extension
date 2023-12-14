import * as React from 'react';
import { Container, Row, Col, Form} from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { TbListDetails } from "react-icons/tb";
import API_ENDPOINTS from '../apiConfig';
import { timezones } from '../../lib/timezones';


function Copyright() {
  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Col xs="auto" className="text-secondary text-center">
          {'Copyright © '}
          <a href="https://appfoster.com/" className="text-inherit">
            Skoop
          </a>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Col>
      </Row>
    </Container>
  );
}

export default function SignUp(props) {
  const [selectedOption,setSelectedOption]=React.useState("")
  const handleSubmit = async(event) => {
    event.preventDefault();
    try{
      const data = new FormData(event.currentTarget);
      if(data.get("password")!==data.get("confirmPassword")){
        alert("Password fields do not match try again")
        return ;
      }
      if(data.get("timezone")=="Select Timezone"){
        alert("please select a timezone")
        return ;
      }
      const res=await fetch(API_ENDPOINTS.signUp,{
          method: "POST",
          body: JSON.stringify({
              password : data.get("password"),
              first_name: data.get("firstName"),
              last_name: data.get("lastName"),
              email: data.get("email"),
              timezone: data.get("timezone"),
              services: [1,2,3]
          }),
          headers:{
              "Content-type": "application/json; charset=UTF-8"
          }
      })
      if(res.ok){
          alert("sign-up was successfull")
      }
      else alert("username already exists pick a different username")
    }catch(err){
      console.log(err)
      alert("some error occurred")
    }
  };

  return (
    <div>
    <FaTimes style={{ cursor: 'pointer', fontSize: '2rem', position: 'absolute', top: '2', right: '3' }} onClick={props.close} />
    <Container style={{ maxWidth: '90%', height: '70%', marginTop: '7rem', borderRadius: '1rem', position: 'relative' }}>
      <Row className="justify-content-md-center">
      <Col xs={12} md={10}>
      <div className="text-center mb-4">
            <TbListDetails style={{ fontSize:"16px" }}/> 
            <h2>Sign Up</h2>
          </div>
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="firstName">
              <Form.Control
                type="text"
                placeholder="First Name"
                required
                name="firstName"
                autoComplete="given-name"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="lastName">
              <Form.Control
                type="text"
                placeholder="Last Name"
                required
                name="lastName"
                autoComplete="family-name"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Control
                type="email"
                placeholder="Email Address"
                required
                name="email"
                autoComplete="email"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                required
                autoComplete="new-password"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                required
                name="confirmPassword"
                autoComplete="new-password"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="timezone">
              <Form.Select
                value={selectedOption}
                required
                name="timezone"
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option>Select Timezone</option>
                {timezones.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <br></br>
            <button 
            type="submit" 
            className=" w-100 mb-2" 
            style={{ fontSize: '1.5rem', color:'#FFFFFF', backgroundColor:'#0a66c2', border: '1' }}>
              Sign Up
            </button>
          </Form>
        </Col>
      </Row>
      <Row className="mt-2 justify-content-center">
        <Col xs={12} className="text-center">
          <p>
            Already have an account?{' '}
            <a
                href="#"
                className="text-secondary"
                onClick={() => {
                  props.changePage('SignIn');
                }}
              >
                Sign in
              </a>
          </p>
        </Col>
      </Row>
      <Copyright/>
    </Container>
    </div>
  );
}