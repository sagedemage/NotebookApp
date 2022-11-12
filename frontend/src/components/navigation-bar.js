/* Navigation Bar */

import "./navigation-bar.css";

import { Nav, Navbar, Container } from 'react-bootstrap';

import NavDropdown from 'react-bootstrap/NavDropdown';

import Cookies from "universal-cookie";

import axios from "axios";

import {useEffect, useState} from "react";

import { useAuth } from "./auth";

import { Logout } from "./logout";

export const MyNavBar = () => {
	
	//const isAuth = useAuth();

	const [isAuth, setAuth] = useState(false);

	useEffect(() => {
		/* Fetch all the Notes for the Current User */
		const cookies = new Cookies();
		const token = cookies.get("token");
		console.log(token)
		if (token !== undefined) {
			axios.post(`http://localhost:8080/api/get-decoded-token`, {
				token: token,
			}).then((response) => {
				//setNotes(response.data.notes);
				if (response.data.auth === true) {
					setAuth(true)
				}
				else {
					setAuth(false)
				}
				console.log("Response data " + response.data.auth);
			}).catch(e => {
				console.log(e);
			})
		}
		else {
			setAuth(false)
		}
	}, []);

	return (
		<div className="mb">
			<Navbar collapseOnSelect expand="lg" bg="myBlue" variant="dark" fixed="top">
				<Container>
					<Navbar.Brand>
						<span className="indent"> Notebook </span>
					</Navbar.Brand>
			
					<Navbar.Toggle aria-controls="responsive-navbar-nav"  />
					<Navbar.Collapse id="responsive-navbar-nav">
						<Nav className="me-auto">
							<Nav.Link href="/"> Home </Nav.Link>
							<Nav.Link href="/about"> About </Nav.Link>
						</Nav>
						{ isAuth === false &&
						<Nav className="ms-auto">
							<Nav.Link href="/login"> Login </Nav.Link>
							<Nav.Link href="/register"> Register </Nav.Link>
						</Nav>
						}
						{ isAuth === true &&
						<Nav className="ms-auto">
							<NavDropdown
							  id="nav-dropdown"
							  title="Account"
							  menuVariant="dark"
							  variant="dark"
							>
								<NavDropdown.Item href="/dashboard">Notes</NavDropdown.Item>
								<NavDropdown.Item onClick={() => Logout() }>Logout</NavDropdown.Item>
							</NavDropdown>
						</Nav>
						}
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</div>
		
	);
}
