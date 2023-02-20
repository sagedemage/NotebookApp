/* View Notes (Dashboard) */

import { useEffect, useState, ChangeEventHandler, FormEventHandler } from "react";
import { getToken } from "components/token/token";
import axios from "axios";
import "./view_notes.css";

export default function Notes() {
	/* View Notes Page (Dashboard Page) */
	const [notes, setNotes] = useState([]);
	//const [open_edit_form_box, setOpenEditFormBox] = useState(false);
	const [open_add_form_box, setOpenAddFormBox] = useState(false);
	const [open_delete_confirm_box, setOpenDeleteConfirmBox] = useState(false);
	const [note_id, setNoteId] = useState<number | undefined>(undefined);

	const [title_edit, setTitleEdit] = useState('');
	const [description_edit, setDescriptionEdit] = useState('');

	const [title_add, setTitleAdd] = useState('');
	const [description_add, setDescriptionAdd] = useState('');

	const edit_note_dialog = (document.getElementById("EditNoteDialog") as HTMLDialogElement) 
	const inactive_area_dialog = (document.getElementById("InactiveAreaDialog") as HTMLDialogElement) 

	/*	
	Handle title and description changes
	for the edit and add note forms 
	*/
	const handleTitleEditChange: ChangeEventHandler = e => {
		const target = e.target as HTMLInputElement;
		setTitleEdit(target.value);
	};
	const handleDescriptionEditChange: ChangeEventHandler = e => {
		const target = e.target as HTMLInputElement;
		setDescriptionEdit(target.value);
	};

	const handleTitleAddChange: ChangeEventHandler = e => {
		const target = e.target as HTMLInputElement;
		setTitleAdd(target.value);
	};
	const handleDescriptionAddChange: ChangeEventHandler = e => {
		const target = e.target as HTMLInputElement;
		setDescriptionAdd(target.value);
	};

	useEffect(() => {
		/* Fetch all the Notes for the Current User */
		const token = getToken();
		let user_id = undefined;
		if (token !== undefined) {
			axios.post(`http://localhost:8080/api/get-decoded-token`, {
				token: token,
			}).then((response) => {
				if (response.data.user_id !== undefined) {
					user_id = response.data.user_id;
					axios.post(`http://localhost:8080/api/view-notes`, {
						user_id: user_id,
					}).then((response) => {
						setNotes(response.data.notes);
					}).catch(e => {
						console.log(e);
					})
				}

			}).catch(e => {
				console.log(e);
			})
		}
	}, []);

	/* Add Note */
	const handleAddSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
		/* Add New Note Submission */
		e.preventDefault();
		const token = getToken();
		let user_id = undefined;
		if (token !== undefined) {
			axios.post(`http://localhost:8080/api/get-decoded-token`, {
				token: token,
			}).then((response) => {
				if (response.data.user_id !== undefined) {
					user_id = response.data.user_id;
					axios.post(`http://localhost:8080/api/add-new-note`, {
						title: title_add,
						description: description_add,
						user_id: user_id,
					}).then(() => {
						// redirect to the dashboard
						window.location.href = '/dashboard';
					}).catch(e => {
						console.log(e);
					})
				}
			}).catch(e => {
				console.log(e);
			})
		}
	};

	const OpenAddFormBox = () => {
		/* Open Add Confirm Popup Window */
		setOpenAddFormBox(true);
	}

	const CloseAddFormBox = () => {
		setOpenAddFormBox(false);
	}

	/* Edit Note */
	const handleEditSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		console.log(typeof note_id);
		axios.post(`http://localhost:8080/api/edit-note`, {
			note_id: note_id,
			title: title_edit,
			description: description_edit,
		}).then(() => {
			// redirect to the dashboard
			window.location.reload();
		}).catch(e => {
			console.log(e);
		})
	};

	function OpenEditFormBox(note_id: string) {
		/* Open Edit Note Form Popup Window */
		// Fetch Note
		axios.post(`http://localhost:8080/api/fetch-note`, {
			note_id: note_id,
		}).then((response) => {
			if (note_id !== undefined) {
				setTitleEdit(response.data.title);
				setDescriptionEdit(response.data.description);
			}
		}).catch(e => {
			console.log(e);
		})

		// set note id
		setNoteId(parseInt(note_id));

		// open edit form box
		//setOpenEditFormBox(true);

		inactive_area_dialog.show();
		edit_note_dialog.show();


	}

	const CloseEditFormBox = () => {
		/* Close Edit Form Popup Window */
		//setOpenEditFormBox(false);
		edit_note_dialog.close()
		inactive_area_dialog.close();
	}

	/* Delete Note */
	const handleDeleteSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		axios.post(`http://localhost:8080/api/delete-note`, {
			note_id: note_id,
		}).then(() => {
			// redirect to the dashboard
			window.location.reload();
		}).catch(e => {
			console.log(e);
		})
	};



	function OpenDeleteConfirmBox(note_id: string) {
		/* Open Delete Confirm Popup Window */
		setNoteId(parseInt(note_id));

		setOpenDeleteConfirmBox(true);
	}

	const CloseDeleteConfirmBox = () => {
		setOpenDeleteConfirmBox(false);
	}


	return (
		<div>
			<h2> Notes </h2>
			<form method="post">
				<button id="add-note" type="button" className="btn btn-primary" onClick={OpenAddFormBox}>
					Add
				</button>
			</form>
			{notes.map((note, i) => {
				return (
					<div className="container note-entry" key={i}>
						<h2 className="note-title"> {note["Title"]} </h2>
						<p> {note["Description"]} </p>
						<div className="row">
							<div className="col col-md-auto">
								<button id="edit-note" className="btn btn-primary"
									onClick={() => OpenEditFormBox(note["ID"])}>Edit</button>
							</div>
							<div className="col col-md-auto">
								<button id="delete-note" className="btn btn-danger"
									onClick={() => OpenDeleteConfirmBox(note["ID"])}>Delete</button>
							</div>
						</div>
					</div>
				)
			})}

			<dialog id="InactiveAreaDialog" className="inactive_area">
			</dialog>

			<dialog id="EditNoteDialog" className="dialog">
				<h2> Edit Note </h2>
				<form method="post" onSubmit={handleEditSubmit}>
					<div className="form-group">
						<label htmlFor="exampleFormControlInput1">Title</label>
						<input className="form-control" id="exampleFormControlInput1"
							name="title" placeholder="Title"
							value={title_edit}
							onChange={handleTitleEditChange}
							required />
					</div>
					<div className="form-group">
						<label htmlFor="exampleFormControlTextarea1">Description</label>
						<textarea className="form-control" id="exampleFormControlTextarea1"
							name="description" rows={3} placeholder="Description"
							value={description_edit}
							onChange={handleDescriptionEditChange}
							required> </textarea>
					</div>

					<button type="submit" className="btn btn-primary">Submit</button>
					<button type="button" className="btn btn-secondary"
						onClick={CloseEditFormBox}>
						Close
					</button>
				</form>
			</dialog>

			{open_delete_confirm_box === true &&
				<div className="inactive_area">
					<div className="box">
						<h2> Delete Note </h2>
						<p> You sure you want to delete the note? </p>
						<form method="post" onSubmit={handleDeleteSubmit}>
							<button type="submit" className="btn btn-danger">
								Delete
							</button>
							<button type="button" className="btn btn-secondary"
								onClick={CloseDeleteConfirmBox}>
								Back
							</button>
						</form>
					</div>
				</div>
			}
			{open_add_form_box === true &&
				<div className="inactive_area">
					<div className="box">
						<h2> Add Note </h2>
						<form method="post" onSubmit={handleAddSubmit}>
							<div className="form-group">
								<label htmlFor="exampleFormControlInput1">Title</label>
								<input className="form-control" id="exampleFormControlInput1"
									name="title" placeholder="Title"
									value={title_add}
									onChange={handleTitleAddChange}
									required />
							</div>
							<div className="form-group">
								<label htmlFor="exampleFormControlTextarea1">Description</label>
								<textarea className="form-control" id="exampleFormControlTextarea1"
									name="description" rows={3} placeholder="Description"
									value={description_add}
									onChange={handleDescriptionAddChange}
									required> </textarea>
							</div>
							<button type="submit" className="btn btn-primary">
								Submit
							</button>
							<button type="button" className="btn btn-secondary"
								onClick={CloseAddFormBox}>
								Back
							</button>
						</form>
					</div>
				</div>
			}
		</div>
	);
}
