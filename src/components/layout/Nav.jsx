
import React from 'react';
import { Link } from 'react-router-dom';

export default function Nav() {
	return (
		<nav className="navbar">
			<ul className="navbar-list">
				<li className="navbar-item"><Link to="/" className="navbar-link">Home</Link></li>
				<li className="navbar-item"><Link to="/about" className="navbar-link">About</Link></li>
				<li className="navbar-item"><Link to="/tricky" className="navbar-link">Tricky</Link></li>
				<li className="navbar-item"><Link to="/login" className="navbar-link">Login</Link></li>
			</ul>
		</nav>
	);
}
