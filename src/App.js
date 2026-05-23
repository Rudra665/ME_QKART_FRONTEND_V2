import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks";

// The endpoint used across the app
const apiBaseUrl = ipConfig.workspaceIp.startsWith("https")
	? ipConfig.workspaceIp
	: `http://${ipConfig.workspaceIp}`;

export const config = {
	endpoint: `${apiBaseUrl.replace(/\/$/, "")}/api/v1`,
};

function App() {
	return (
		<div className="App">
			{/* 1. SnackbarProvider is required for enqueueSnackbar to work */}
			<SnackbarProvider
				maxSnack={1}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
				preventDuplicate
			>
				<Router>
					<Switch>
						{/* 2. Set up the route for the Register page */}
						<Route path="/register">
							<Register />
						</Route>
						<Route path="/login">
							<Login />
						</Route>
						<Route path="/products">
							<Products />
						</Route>
						<Route path="/thanks">
							<Thanks />
						</Route>
						<Route path="/checkout">
							<Checkout />
						</Route>

						{/* 3. Default route (can be login or landing later) */}
						<Route exact path="/" component={Products} />
					</Switch>
				</Router>
			</SnackbarProvider>
		</div>
	);
}

export default App;
