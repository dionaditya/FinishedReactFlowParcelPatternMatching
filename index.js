// @flow
import React, { useEffect, useReducer } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

// initialize type untuk Drone field
type Drone = {
	name: string,
	has_it_competed: boolean
};

// initialize type untuk State
type State = {
	drones: Array<any>,
	loading: boolean,
	error: boolean
};

// declare drone variable
const drone: Drone = {
	name: "",
	has_it_competed: false
};

// declare initialState variable
const initialState: State = {
	drones: [drone],
	loading: true,
	error: false
};

// reducer
const reducer = (state, action) => {
	switch (action.type) {
		case "DronesLoaded":
			console.log(action.payload);
			return {
				...state,
				drones: action.payload,
				loading: false
			};

		case "DronesLoadedFailed":
			return {
				...state,
				loading: false,
				error: true
			};

		default:
			throw new Error();
	}
};

function HelloMessage() {
	// usereducer
	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		// get drones data
		const getDrones = async () => {
			try {
				const response = await axios.get(
					"https://my-json-server.typicode.com/dionaditya/dbdrones/db"
				);
				console.log(response.data.results);
				dispatch({
					type: "DronesLoaded",
					payload: response.data.results
				});
			} catch {
				dispatch({
					type: "DronesLoadedFailed",
					payload: "error"
				});
			}
		};
		getDrones();
	}, []);

	console.log(state);

	// conditional rendering with pattern matching mimics
	switch (true) {
		case state.loading:
			return <div> Loading ....</div>;

		case state.error:
			return <div> Error</div>;

		default:
			if (state.drones.length <= 0) {
				return <div>Belum ada data</div>;
			} else {
				return (
					<div>
						{state.drones.map((drone, i) => {
							return (
								<ul>
									<li key={i}> {drone.name} </li>
								</ul>
							);
						})}
					</div>
				);
			}
	}
}

const mountNode = document.getElementById("app");

if (mountNode !== null) {
	ReactDOM.render(<HelloMessage />, mountNode);
}