import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getSubjectList, updateSubject } from '../../../redux/sclassRelated/sclassHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import PostAddIcon from '@mui/icons-material/PostAdd';
import {
    Paper, Box, IconButton, TextField, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TableTemplate from '../../../components/TableTemplate';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';

const ShowSubjects = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { subjectsList, loading, error, response } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getSubjectList(currentUser._id, "AllSubjects"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [editSubject, setEditSubject] = useState(null);

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
        setMessage("Sorry the delete function has been disabled for now.");
        setShowPopup(true);

        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getSubjectList(currentUser._id, "AllSubjects"));
            });
    };

    const handleEditOpen = (subject) => {
        setEditSubject(subject);
    };

    const handleEditClose = () => {
        setEditSubject(null);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditSubject(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleEditSave = () => {
        dispatch(updateSubject(editSubject))
            .then(() => {
                dispatch(getSubjectList(currentUser._id, "AllSubjects"));
                handleEditClose();
            });
    };

    const subjectColumns = [
        { id: 'subName', label: 'Sub Name', minWidth: 170 },
        { id: 'sessions', label: 'Sessions', minWidth: 170 },
        { id: 'sclassName', label: 'Class', minWidth: 170 },
    ];

    const subjectRows = subjectsList.map((subject) => {
        return {
            subName: subject.subName,
            sessions: subject.sessions,
            sclassName: subject.sclassName.sclassName,
            sclassID: subject.sclassName._id,
            id: subject._id,
        };
    });

    const SubjectsButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Subject")}>
                    <DeleteIcon color="error" />
                </IconButton>
                <BlueButton variant="contained"
                    onClick={() => navigate(`/Admin/subjects/subject/${row.sclassID}/${row.id}`)}>
                    View
                </BlueButton>
                <IconButton onClick={() => handleEditOpen(row)}>
                    <EditIcon color="primary" />
                </IconButton>
            </>
        );
    };

    const actions = [
        {
            icon: <PostAddIcon color="primary" />, name: 'Add New Subject',
            action: () => navigate("/Admin/subjects/chooseclass")
        },
        {
            icon: <DeleteIcon color="error" />, name: 'Delete All Subjects',
            action: () => deleteHandler(currentUser._id, "Subjects")
        }
    ];

    return (
        <>
            {loading ?
                <div>Loading...</div>
                :
                <>
                    {response ?
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            <GreenButton variant="contained"
                                onClick={() => navigate("/Admin/subjects/chooseclass")}>
                                Add Subjects
                            </GreenButton>
                        </Box>
                        :
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            {Array.isArray(subjectsList) && subjectsList.length > 0 &&
                                <TableTemplate buttonHaver={SubjectsButtonHaver} columns={subjectColumns} rows={subjectRows} />
                            }
                            <SpeedDialTemplate actions={actions} />
                        </Paper>
                    }
                </>
            }
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
            {editSubject && (
                <Dialog open={Boolean(editSubject)} onClose={handleEditClose}>
                    <DialogTitle>Edit Subject</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            name="subName"
                            label="Subject Name"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={editSubject.subName}
                            onChange={handleEditChange}
                        />
                        <TextField
                            margin="dense"
                            name="sessions"
                            label="Sessions"
                            type="number"
                            fullWidth
                            variant="standard"
                            value={editSubject.sessions}
                            onChange={handleEditChange}
                        />
                        <TextField
                            margin="dense"
                            name="sclassName"
                            label="Class Name"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={editSubject.sclassName}
                            onChange={handleEditChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <BlueButton onClick={handleEditSave}>Save</BlueButton>
                        <BlueButton onClick={handleEditClose}>Cancel</BlueButton>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
};

export default ShowSubjects;
